import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  Booking,
  BookingDocument,
  BookingStatus,
  DepositStatus,
  PaymentStatus,
} from '../schemas/booking.schema';
import { Table, TableDocument } from '../../tables/schemas/table.schema';
import { RestaurantsService } from '../../restaurants/restaurants.service';
import { PricingRuleService } from '../../pricing-rule/pricing-rule.service';
import { PaymentService } from '../../payment/payment.service';
import { RestaurantBookingSearchService } from '../booking-restaurant-search.service';
import { BookingLockService } from './booking-lock.service';
import { BookingValidationService } from './booking-validation.service';
import { CreateBookingDto } from '../dto/create-booking.dto';
import { CancelBookingDto } from '../dto/cancel-booking.dto';
import { getBookingHoldKey } from '@app/helpers/redis/booking-hold-key.util';
import {
  combineBookingDateAndTime,
  combineDateAndTime,
  minutesToTime,
  timeToMinutes,
} from '../utils/booking-time.util';

@Injectable()
export class BookingStateService {
  private readonly logger = new Logger(BookingStateService.name);

  constructor(
    @InjectModel(Booking.name)
    private readonly bookingModel: Model<BookingDocument>,
    @InjectModel(Table.name)
    private readonly tableModel: Model<TableDocument>,
    @Inject(forwardRef(() => RestaurantsService))
    private readonly restaurantsService: RestaurantsService,
    private readonly pricingRuleService: PricingRuleService,
    private readonly paymentService: PaymentService,
    private readonly restaurantSearchService: RestaurantBookingSearchService,
    private readonly bookingLockService: BookingLockService,
    private readonly bookingValidationService: BookingValidationService,
  ) {}

  async createBooking(
    restaurantId: string,
    userId: string,
    dto: CreateBookingDto,
  ) {
    if (!Types.ObjectId.isValid(restaurantId)) {
      throw new BadRequestException('Định dạng ID nhà hàng không hợp lệ');
    }

    if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestException('Định dạng ID người dùng không hợp lệ');
    }

    if (!dto.tableIds || dto.tableIds.length === 0) {
      throw new BadRequestException('Phải chọn ít nhất một bàn');
    }

    const uniqueTableIds = new Set(dto.tableIds);
    if (uniqueTableIds.size !== dto.tableIds.length) {
      throw new BadRequestException('Không được chọn trùng bàn');
    }

    const bookingDate = new Date(dto.bookingDate);
    if (isNaN(bookingDate.getTime())) {
      throw new BadRequestException('Ngày đặt bàn không hợp lệ');
    }

    const restaurant =
      await this.restaurantsService.getRestaurantById(restaurantId);

    if (restaurant.isAcceptingBookings === false) {
      throw new ConflictException('Nhà hàng hiện không nhận đặt bàn');
    }

    const restaurantObjectId = new Types.ObjectId(restaurantId);
    const now = new Date();

    const advanceBookingDays = restaurant.advanceBookingDays ?? 30;
    const maxBookingDate = new Date(now);
    maxBookingDate.setHours(23, 59, 59, 999);
    maxBookingDate.setDate(maxBookingDate.getDate() + advanceBookingDays);

    if (bookingDate > maxBookingDate) {
      throw new BadRequestException(
        `Chỉ được đặt bàn trước tối đa ${advanceBookingDays} ngày`,
      );
    }

    const reservationDuration =
      restaurant.defaultReservationDurationMinutes ?? 120;

    const startMinutes = timeToMinutes(dto.startTime);
    const endMinutes = startMinutes + reservationDuration;

    if (startMinutes < 0 || startMinutes >= 24 * 60) {
      throw new BadRequestException('Thời gian bắt đầu không hợp lệ');
    }

    if (endMinutes > 24 * 60) {
      throw new BadRequestException('Thời gian đặt bàn vượt quá 24 giờ');
    }

    const endTime = minutesToTime(endMinutes);

    const minBookingNoticeMinutes = restaurant.minBookingNoticeMinutes ?? 60;
    const bookingStart = new Date(bookingDate);
    const [hours, minutes] = dto.startTime.split(':').map(Number);
    bookingStart.setHours(hours, minutes, 0, 0);

    const minimumBookingTime = new Date(
      now.getTime() + minBookingNoticeMinutes * 60 * 1000,
    );

    if (bookingStart < minimumBookingTime) {
      throw new BadRequestException(
        `Phải đặt bàn trước ít nhất ${minBookingNoticeMinutes} phút`,
      );
    }

    const tableObjectIds = dto.tableIds.map((id) => {
      if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException(`Table ID không hợp lệ: ${id}`);
      }
      return new Types.ObjectId(id);
    });

    const tables = await this.tableModel
      .find({
        _id: { $in: tableObjectIds },
        restaurantId: restaurantObjectId,
      })
      .lean();

    this.bookingValidationService.validateTablesAndCapacity(
      tables,
      dto.tableIds,
      dto.guestCount,
    );

    await this.bookingValidationService.validateTableAvailability(
      restaurantObjectId,
      bookingDate,
      dto.startTime,
      endTime,
      tableObjectIds,
    );

    await this.bookingValidationService.validateBookingConflict(
      restaurantObjectId,
      bookingDate,
      dto.startTime,
      endTime,
      tableObjectIds,
    );

    const pricing = await this.pricingRuleService.previewBookingPricing(
      restaurantId,
      {
        tableIds: dto.tableIds,
        bookingDate: dto.bookingDate,
        startTime: dto.startTime,
      },
    );

    const requiresDeposit = pricing.depositStatus === DepositStatus.PENDING;
    const depositPaymentTimeoutMinutes =
      restaurant.depositPaymentTimeoutMinutes ?? 30;

    const holdExpiresAt = requiresDeposit
      ? new Date(Date.now() + depositPaymentTimeoutMinutes * 60 * 1000)
      : undefined;

    const holdTtlSeconds = requiresDeposit
      ? Math.max(1, Math.ceil((holdExpiresAt!.getTime() - Date.now()) / 1000))
      : 0;

    let acquiredLockKeys: string[] = [];

    if (requiresDeposit) {
      acquiredLockKeys = await this.bookingLockService.acquireBookingTableLocks(
        restaurantId,
        dto.tableIds,
        bookingDate,
        dto.startTime,
        endTime,
        'pending',
        holdTtlSeconds,
      );
    }

    try {
      const booking = await this.bookingModel.create({
        userId: new Types.ObjectId(userId),
        restaurantId: restaurantObjectId,
        guestCount: dto.guestCount,
        restaurantNote: dto.restaurantNote,
        status: BookingStatus.PENDING,
        contactName: dto.contactName,
        contactPhone: dto.contactPhone,
        bookingDate,
        tableIds: tableObjectIds,
        startTime: dto.startTime,
        endTime,
        paymentStatus: PaymentStatus.UNPAID,
        depositAmount: pricing.depositAmount,
        depositStatus: pricing.depositStatus,
        tableDeposits: pricing.tableDeposits,
        holdExpiresAt,
        pricingSnapshot: {
          basePrice: pricing.basePrice,
          finalPrice: pricing.finalPrice,
          adjustments: pricing.adjustments,
          calculatedAt: pricing.calculatedAt,
        },
      });

      await this.restaurantSearchService.index(booking);

      return {
        booking,
        payDepositNow: dto.payDepositNow,
      };
    } catch (error) {
      if (acquiredLockKeys.length > 0) {
        await this.bookingLockService.releaseBookingTableLocks(
          acquiredLockKeys,
        );
      }
      throw error;
    }
  }

  async cancelBooking(
    bookingId: string,
    userId: string,
    dto: CancelBookingDto,
  ) {
    if (!Types.ObjectId.isValid(bookingId)) {
      throw new BadRequestException('Định dạng booking ID không hợp lệ');
    }

    const session = await this.bookingModel.db.startSession();

    try {
      const result = await session.withTransaction(async () => {
        const booking = await this.bookingModel
          .findById(bookingId)
          .session(session)
          .exec();

        if (!booking) {
          throw new NotFoundException('Không tìm thấy booking');
        }

        const userObjectId = new Types.ObjectId(userId);
        if (booking.userId.toString() !== userObjectId.toString()) {
          throw new ForbiddenException('Bạn không có quyền hủy booking này');
        }

        const cancellableStatuses = [
          BookingStatus.PENDING,
          BookingStatus.CONFIRMED,
        ];

        if (!booking.status || !cancellableStatuses.includes(booking.status)) {
          throw new BadRequestException(
            `Không thể hủy booking ở trạng thái ${
              booking.status ?? 'không xác định'
            }`,
          );
        }

        const bookingDateTime = combineDateAndTime(
          booking.bookingDate,
          booking.startTime,
        );

        const now = new Date();

        if (bookingDateTime <= now) {
          throw new BadRequestException(
            'Không thể hủy booking đã đến giờ sử dụng',
          );
        }

        const diffMinutes =
          (bookingDateTime.getTime() - now.getTime()) / (1000 * 60);

        const REFUND_LIMIT_MINUTES = 120;
        const shouldRefund =
          diffMinutes >= REFUND_LIMIT_MINUTES &&
          booking.paymentStatus !== PaymentStatus.UNPAID;

        booking.status = BookingStatus.CANCELLED;
        booking.cancelledAt = now;
        booking.cancelReason = dto.reason;
        booking.cancelledBy = userObjectId;
        booking.holdExpiresAt = undefined;

        if (booking.paymentStatus === PaymentStatus.UNPAID) {
          if (booking.depositStatus === DepositStatus.PENDING) {
            booking.depositStatus = DepositStatus.FORFEITED;
          }
        } else if (!shouldRefund) {
          if (booking.depositStatus === DepositStatus.PAID) {
            booking.depositStatus = DepositStatus.FORFEITED;
          }
        }

        await booking.save({ session });

        return {
          booking,
          shouldRefund,
        };
      });

      if (result.shouldRefund) {
        await this.paymentService.refundBooking(result.booking._id.toString());
        result.booking.paymentStatus = PaymentStatus.REFUNDED;

        if (result.booking.depositStatus === DepositStatus.PAID) {
          result.booking.depositStatus = DepositStatus.REFUNDED;
        }

        await result.booking.save();
      }

      await this.restaurantSearchService.update(result.booking);

      for (const tableId of result.booking.tableIds) {
        const holdKey = getBookingHoldKey(
          result.booking.restaurantId.toString(),
          tableId.toString(),
          result.booking.bookingDate,
          result.booking.startTime,
          result.booking.endTime,
        );

        await this.bookingLockService.releaseBookingTableLocks([holdKey]);
      }

      return result.booking;
    } finally {
      await session.endSession();
    }
  }

  async rejectBooking(bookingId: string, userId: string, reason: string) {
    if (!Types.ObjectId.isValid(bookingId)) {
      throw new BadRequestException('Định dạng booking ID không hợp lệ');
    }

    if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestException('Định dạng user ID không hợp lệ');
    }

    const session = await this.bookingModel.db.startSession();

    try {
      const result = await session.withTransaction(async () => {
        const booking = await this.bookingModel
          .findById(bookingId)
          .session(session)
          .exec();

        if (!booking) {
          throw new NotFoundException('Không tìm thấy booking');
        }

        const restaurant =
          await this.restaurantsService.getRestaurantByUserId(userId);

        if (!restaurant) {
          throw new NotFoundException('Không tìm thấy nhà hàng của người dùng');
        }

        if (booking.restaurantId.toString() !== restaurant._id.toString()) {
          throw new ForbiddenException('Booking không thuộc nhà hàng này');
        }

        const rejectableStatuses = [
          BookingStatus.PENDING,
          BookingStatus.CONFIRMED,
        ];

        if (!booking.status || !rejectableStatuses.includes(booking.status)) {
          throw new BadRequestException(
            `Không thể từ chối booking ở trạng thái ${
              booking.status ?? 'không xác định'
            }`,
          );
        }

        const bookingDateTime = combineDateAndTime(
          booking.bookingDate,
          booking.startTime,
        );

        const now = new Date();

        if (bookingDateTime <= now) {
          throw new BadRequestException(
            'Không thể từ chối booking đã đến giờ sử dụng',
          );
        }

        booking.status = BookingStatus.REJECTED;
        booking.rejectionReason = reason;
        booking.holdExpiresAt = undefined;

        await booking.save({ session });

        return {
          booking,
          shouldRefund:
            booking.paymentStatus === PaymentStatus.PAID ||
            booking.paymentStatus === PaymentStatus.PARTIAL,
        };
      });

      if (result.shouldRefund) {
        await this.paymentService.refundBooking(result.booking._id.toString());
        result.booking.paymentStatus = PaymentStatus.REFUNDED;

        if (result.booking.depositStatus === DepositStatus.PAID) {
          result.booking.depositStatus = DepositStatus.REFUNDED;
        }

        await result.booking.save();
      }

      await this.restaurantSearchService.update(result.booking);

      for (const tableId of result.booking.tableIds) {
        const holdKey = getBookingHoldKey(
          result.booking.restaurantId.toString(),
          tableId.toString(),
          result.booking.bookingDate,
          result.booking.startTime,
          result.booking.endTime,
        );

        await this.bookingLockService.releaseBookingTableLocks([holdKey]);
      }

      return result.booking;
    } finally {
      await session.endSession();
    }
  }

  async checkInBooking(bookingId: string, userId: string) {
    if (!Types.ObjectId.isValid(bookingId)) {
      throw new BadRequestException('Định dạng booking ID không hợp lệ');
    }

    if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestException('Định dạng user ID không hợp lệ');
    }

    const restaurant =
      await this.restaurantsService.getRestaurantByUserId(userId);

    if (!restaurant) {
      throw new NotFoundException('Không tìm thấy nhà hàng của tài khoản này');
    }

    const booking = await this.bookingModel.findOne({
      _id: new Types.ObjectId(bookingId),
      restaurantId: restaurant._id,
    });

    if (!booking) {
      throw new NotFoundException('Không tìm thấy booking thuộc nhà hàng này');
    }

    if (booking.status === BookingStatus.CHECKED_IN) {
      throw new BadRequestException('Booking này đã được check-in trước đó');
    }

    if (booking.status !== BookingStatus.CONFIRMED) {
      throw new BadRequestException(
        `Không thể check-in booking đang ở trạng thái ${booking.status}`,
      );
    }

    booking.status = BookingStatus.CHECKED_IN;
    booking.checkedInAt = new Date();

    await booking.save();
    await this.restaurantSearchService.update(booking);

    return {
      _id: booking._id,
      status: booking.status,
      checkedInAt: booking.checkedInAt,
      bookingDate: booking.bookingDate,
      startTime: booking.startTime,
      endTime: booking.endTime,
      guestCount: booking.guestCount,
      checkInCode: booking.checkInCode,
    };
  }

  async processExpiredPendingBookings(): Promise<number> {
    const now = new Date();

    const bookings = await this.bookingModel.find({
      status: BookingStatus.PENDING,
      holdExpiresAt: { $lte: now },
    });

    let count = 0;

    for (const booking of bookings) {
      booking.status = BookingStatus.CANCELLED;
      booking.cancelledAt = now;
      booking.cancelReason =
        'Hệ thống tự động hủy do không thanh toán đặt cọc đúng hạn';

      await booking.save();

      try {
        const holdKeys = booking.tableIds.map((tableId) =>
          getBookingHoldKey(
            booking.restaurantId.toString(),
            tableId.toString(),
            booking.bookingDate,
            booking.startTime,
            booking.endTime,
          ),
        );
        await this.bookingLockService.releaseBookingTableLocks(holdKeys);
      } catch (error) {
        this.logger.warn(
          `Failed to release Redis hold for booking : ${
            error instanceof Error ? error.message : error
          }`,
        );
      }

      try {
        await this.restaurantSearchService.update(booking);
      } catch (error) {
        this.logger.warn(
          `Failed to update restaurant search index for booking : ${
            error instanceof Error ? error.message : error
          }`,
        );
      }

      count++;
    }

    return count;
  }

  async processNoShowBookings(): Promise<number> {
    const now = new Date();

    const bookings = await this.bookingModel.find({
      status: BookingStatus.CONFIRMED,
      checkedInAt: { $exists: false },
    });

    let count = 0;

    for (const booking of bookings) {
      const endDateTime = combineBookingDateAndTime(
        booking.bookingDate,
        booking.endTime,
      );

      if (endDateTime > now) {
        continue;
      }

      booking.status = BookingStatus.NO_SHOW;
      await booking.save();

      try {
        const holdKeys = booking.tableIds.map((tableId) =>
          getBookingHoldKey(
            booking.restaurantId.toString(),
            tableId.toString(),
            booking.bookingDate,
            booking.startTime,
            booking.endTime,
          ),
        );
        await this.bookingLockService.releaseBookingTableLocks(holdKeys);
      } catch (err) {
        this.logger.warn(`Failed to release Redis hold for booking : ${err}`);
      }

      try {
        await this.restaurantSearchService.update(booking);
      } catch (err) {
        this.logger.warn(
          `Failed to update restaurant search index for booking : ${err}`,
        );
      }

      count++;
    }

    return count;
  }
}
