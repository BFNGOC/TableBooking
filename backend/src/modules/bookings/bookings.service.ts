import {
  BadRequestException,
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { InjectModel } from '@nestjs/mongoose';
import {
  Booking,
  BookingDocument,
  BookingStatus,
  DepositStatus,
  PaymentStatus,
} from './schemas/booking.schema';
import { Model, Types } from 'mongoose';
import { RestaurantsService } from '../restaurants/restaurants.service';
import {
  Table,
  TableDocument,
  TableStatus,
} from '../tables/schemas/table.schema';
import {
  TableAvailability,
  TableAvailabilityDocument,
} from '../table-availabilities/schemas/table-availability.schema';
import { PricingRuleService } from '../pricing-rule/pricing-rule.service';
import { RedisService } from '@app/shared/redis/redis.service';
import { GetAvailableTablesDto } from './dto/get-available-tables.dto';
import { Area } from '../areas/schemas/area.schema';
import { getBookingHoldKey } from '@app/helpers/redis/booking-hold-key.util';
import dayjs from 'dayjs';
import { RestaurantBookingSearchService } from './booking-restaurant-search.service';
import { FindRestaurantBookingDto } from './dto/find-restaurant.dto';
import { BookingStatusAggregate } from '../restaurants/types/aggregate';

type PopulatedArea = Area & {
  _id: Types.ObjectId;
};

@Injectable()
export class BookingsService {
  constructor(
    @InjectModel(Booking.name)
    private readonly bookingModel: Model<BookingDocument>,
    @InjectModel(Table.name)
    private readonly tableModel: Model<TableDocument>,
    @Inject(forwardRef(() => RestaurantsService))
    private readonly restaurantsService: RestaurantsService,
    @InjectModel(TableAvailability.name)
    private readonly tableAvailabilityModel: Model<TableAvailabilityDocument>,

    private readonly pricingRuleService: PricingRuleService,

    private readonly redisService: RedisService,

    private readonly restaurantSearchService: RestaurantBookingSearchService,
  ) {}

  async reindexAll() {
    const bookings = await this.bookingModel.find();

    for (const booking of bookings) {
      await this.restaurantSearchService.index(booking);
    }

    return {
      total: bookings.length,
    };
  }

  private async validateTableAvailability(
    restaurantId: Types.ObjectId,
    bookingDate: Date,
    startTime: string,
    endTime: string,
    tableIds: Types.ObjectId[],
  ) {
    const availabilities = await this.tableAvailabilityModel
      .find({
        restaurantId,
        tableIds: {
          $in: tableIds,
        },
      })
      .lean();

    if (availabilities.length === 0) {
      throw new ConflictException(
        'Các bàn đã chọn chưa được cấu hình lịch hoạt động',
      );
    }

    const dateString = bookingDate.toISOString().slice(0, 10);

    const dayOfWeek = bookingDate.getDay();

    const availableTableIds = new Set<string>();

    for (const availability of availabilities) {
      const exception = availability.exceptions?.find(
        (ex) => new Date(ex.date).toISOString().slice(0, 10) === dateString,
      );

      let isTimeValid = false;

      // ============================================
      // EXCEPTION
      // ============================================

      if (exception) {
        if (exception.isClosed) {
          continue;
        }

        isTimeValid =
          exception.slots?.some(
            (slot) => startTime >= slot.startTime && endTime <= slot.endTime,
          ) ?? false;
      }

      // ============================================
      // WEEKLY SLOT
      // ============================================
      else {
        const weeklySlot = availability.weeklySlots?.find(
          (slot) => slot.dayOfWeek === dayOfWeek,
        );

        if (!weeklySlot || !weeklySlot.isActive) {
          continue;
        }

        isTimeValid =
          weeklySlot.slots?.some(
            (slot) => startTime >= slot.startTime && endTime <= slot.endTime,
          ) ?? false;
      }

      if (isTimeValid && availability.tableIds?.length) {
        for (const tableId of availability.tableIds) {
          availableTableIds.add(tableId.toString());
        }
      }
    }

    // ============================================
    // CHECK EVERY REQUESTED TABLE
    // ============================================

    const unavailableTableIds = tableIds.filter(
      (tableId) => !availableTableIds.has(tableId.toString()),
    );

    if (unavailableTableIds.length > 0) {
      throw new ConflictException(
        'Một hoặc nhiều bàn không hoạt động trong khung giờ đã chọn',
      );
    }
  }

  private async releaseBookingTableLocks(keys: string[]) {
    if (keys.length === 0) {
      return;
    }

    await Promise.all(keys.map((key) => this.redisService.delete(key)));
  }

  private async acquireBookingTableLocks(
    restaurantId: string,
    tableIds: string[],
    bookingDate: Date,
    startTime: string,
    endTime: string,
    bookingId: string,
    ttlSeconds: number,
  ) {
    const acquiredKeys: string[] = [];

    try {
      for (const tableId of tableIds) {
        const key = getBookingHoldKey(
          restaurantId,
          tableId,
          bookingDate,
          startTime,
          endTime,
        );

        // Giá trị lưu trong Redis là bookingId
        const result = await this.redisService.setIfNotExists(
          key,
          bookingId,
          ttlSeconds,
        );

        if (!result) {
          throw new ConflictException(
            `Bàn ${tableId} đang được giữ bởi một lượt đặt bàn khác`,
          );
        }

        acquiredKeys.push(key);
      }

      return acquiredKeys;
    } catch (error) {
      // Nếu lock 1 bàn thành công nhưng bàn tiếp theo thất bại
      // thì phải rollback các lock đã acquire
      await this.releaseBookingTableLocks(acquiredKeys);

      throw error;
    }
  }

  private async validateBookingConflict(
    restaurantId: Types.ObjectId,
    bookingDate: Date,
    startTime: string,
    endTime: string,
    tableIds: Types.ObjectId[],
  ) {
    const startOfDay = new Date(bookingDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(bookingDate);
    endOfDay.setHours(23, 59, 59, 999);

    const now = new Date();

    const conflictingBookings = await this.bookingModel.find({
      restaurantId,

      bookingDate: {
        $gte: startOfDay,
        $lt: endOfDay,
      },

      tableIds: {
        $in: tableIds,
      },

      $or: [
        // ======================================
        // 1. Đã thanh toán cọc
        // ======================================
        {
          depositStatus: DepositStatus.PAID,

          status: {
            $in: [
              BookingStatus.PENDING,
              BookingStatus.CONFIRMED,
              BookingStatus.CHECKED_IN,
            ],
          },
        },

        // ======================================
        // 2. Đang chờ thanh toán cọc
        //    và vẫn còn thời gian hold
        // ======================================
        {
          depositStatus: DepositStatus.PENDING,

          paymentStatus: PaymentStatus.UNPAID,

          holdExpiresAt: {
            $gt: now,
          },

          status: BookingStatus.PENDING,
        },

        // ======================================
        // 3. Không yêu cầu cọc
        //    Booking đã confirmed
        // ======================================
        {
          depositStatus: DepositStatus.NOT_REQUIRED,

          status: {
            $in: [BookingStatus.CONFIRMED, BookingStatus.CHECKED_IN],
          },
        },
      ],

      // ======================================
      // TIME OVERLAP
      // ======================================
      startTime: {
        $lt: endTime,
      },

      endTime: {
        $gt: startTime,
      },
    });

    if (conflictingBookings.length > 0) {
      throw new ConflictException(
        'Một hoặc nhiều bàn đã được đặt trong khoảng thời gian này',
      );
    }
  }

  async createBooking(
    restaurantId: string,
    userId: string,
    dto: CreateBookingDto,
  ) {
    // =====================================================
    // 1. VALIDATE BASIC INPUT
    // =====================================================

    if (!Types.ObjectId.isValid(restaurantId)) {
      throw new BadRequestException('Định dạng ID nhà hàng không hợp lệ');
    }

    if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestException('Định dạng ID người dùng không hợp lệ');
    }

    if (!dto.tableIds || dto.tableIds.length === 0) {
      throw new BadRequestException('Phải chọn ít nhất một bàn');
    }

    // Không cho phép chọn trùng bàn
    const uniqueTableIds = new Set(dto.tableIds);

    if (uniqueTableIds.size !== dto.tableIds.length) {
      throw new BadRequestException('Không được chọn trùng bàn');
    }

    // =====================================================
    // 2. VALIDATE BOOKING DATE
    // =====================================================

    const bookingDate = new Date(dto.bookingDate);

    if (isNaN(bookingDate.getTime())) {
      throw new BadRequestException('Ngày đặt bàn không hợp lệ');
    }

    // =====================================================
    // 3. GET RESTAURANT
    // =====================================================

    const restaurant =
      await this.restaurantsService.getRestaurantById(restaurantId);

    // Nhà hàng có đang nhận booking không?
    if (restaurant.isAcceptingBookings === false) {
      throw new ConflictException('Nhà hàng hiện không nhận đặt bàn');
    }

    const restaurantObjectId = new Types.ObjectId(restaurantId);

    // =====================================================
    // 4. VALIDATE BOOKING DATE RANGE
    // =====================================================

    const now = new Date();

    // -----------------------------------------------------
    // 4.1. Không cho đặt quá xa
    // -----------------------------------------------------

    const advanceBookingDays = restaurant.advanceBookingDays ?? 30;

    const maxBookingDate = new Date(now);

    maxBookingDate.setHours(23, 59, 59, 999);

    maxBookingDate.setDate(maxBookingDate.getDate() + advanceBookingDays);

    if (bookingDate > maxBookingDate) {
      throw new BadRequestException(
        `Chỉ được đặt bàn trước tối đa ${advanceBookingDays} ngày`,
      );
    }

    // =====================================================
    // 5. CALCULATE END TIME
    // =====================================================

    const reservationDuration =
      restaurant.defaultReservationDurationMinutes ?? 120;

    const startMinutes = this.timeToMinutes(dto.startTime);

    const endMinutes = startMinutes + reservationDuration;

    if (startMinutes < 0 || startMinutes >= 24 * 60) {
      throw new BadRequestException('Thời gian bắt đầu không hợp lệ');
    }

    if (endMinutes > 24 * 60) {
      throw new BadRequestException('Thời gian đặt bàn vượt quá 24 giờ');
    }

    const endTime = this.minutesToTime(endMinutes);

    // =====================================================
    // 6. VALIDATE MINIMUM BOOKING NOTICE
    // =====================================================

    const minBookingNoticeMinutes = restaurant.minBookingNoticeMinutes ?? 60;

    // Tạo thời gian booking bắt đầu
    //
    // Lưu ý:
    // bookingDate nên là ngày booking theo local timezone
    // của hệ thống bạn.
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

    // =====================================================
    // 7. CONVERT TABLE IDS
    // =====================================================

    const tableObjectIds = dto.tableIds.map((id) => {
      if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException(`Table ID không hợp lệ: ${id}`);
      }

      return new Types.ObjectId(id);
    });

    // =====================================================
    // 8. GET TABLES
    // =====================================================

    const tables = await this.tableModel
      .find({
        _id: {
          $in: tableObjectIds,
        },

        restaurantId: restaurantObjectId,
      })
      .lean();

    if (tables.length !== dto.tableIds.length) {
      throw new BadRequestException(
        'Một hoặc nhiều bàn không tồn tại hoặc không thuộc nhà hàng',
      );
    }

    // =====================================================
    // 9. CHECK TABLE STATUS
    // =====================================================

    const unavailableTable = tables.find(
      (table) => table.status !== TableStatus.AVAILABLE,
    );

    if (unavailableTable) {
      throw new ConflictException('Một hoặc nhiều bàn hiện không khả dụng');
    }

    // =====================================================
    // 10. CHECK CAPACITY
    // =====================================================

    const totalCapacity = tables.reduce(
      (total, table) => total + table.capacity,
      0,
    );

    if (totalCapacity < dto.guestCount) {
      throw new BadRequestException(
        `Tổng sức chứa của các bàn không đủ cho ${dto.guestCount} khách`,
      );
    }

    // =====================================================
    // 11. CHECK TABLE AVAILABILITY
    // =====================================================

    await this.validateTableAvailability(
      restaurantObjectId,
      bookingDate,
      dto.startTime,
      endTime,
      tableObjectIds,
    );

    // =====================================================
    // 12. CHECK MONGODB BOOKING CONFLICT
    // =====================================================

    await this.validateBookingConflict(
      restaurantObjectId,
      bookingDate,
      dto.startTime,
      endTime,
      tableObjectIds,
    );

    // =====================================================
    // 13. CALCULATE PRICING + DEPOSIT
    // =====================================================

    const pricing = await this.pricingRuleService.previewBookingPricing(
      restaurantId,
      {
        tableIds: dto.tableIds,
        bookingDate: dto.bookingDate,
        startTime: dto.startTime,
      },
    );

    // =====================================================
    // 14. CHECK CÓ YÊU CẦU CỌC HAY KHÔNG
    // =====================================================

    const requiresDeposit = pricing.depositStatus === DepositStatus.PENDING;

    // =====================================================
    // 15. CALCULATE DEPOSIT HOLD TIME
    // =====================================================

    const depositPaymentTimeoutMinutes =
      restaurant.depositPaymentTimeoutMinutes ?? 30;

    const holdExpiresAt = requiresDeposit
      ? new Date(Date.now() + depositPaymentTimeoutMinutes * 60 * 1000)
      : undefined;

    // =====================================================
    // 16. CALCULATE REDIS TTL
    // =====================================================

    const holdTtlSeconds = requiresDeposit
      ? Math.max(1, Math.ceil((holdExpiresAt!.getTime() - Date.now()) / 1000))
      : 0;

    // =====================================================
    // 17. ACQUIRE REDIS LOCK
    // =====================================================

    let acquiredLockKeys: string[] = [];

    if (requiresDeposit) {
      acquiredLockKeys = await this.acquireBookingTableLocks(
        restaurantId,
        dto.tableIds,
        bookingDate,
        dto.startTime,
        endTime,
        'pending',
        holdTtlSeconds,
      );
    }

    // =====================================================
    // 18. CREATE BOOKING
    // =====================================================

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

      // ===================================================
      // 19. RETURN BOOKING
      // ===================================================

      return {
        booking,
        payDepositNow: dto.payDepositNow,
      };
    } catch (error) {
      // ===================================================
      // 20. ROLLBACK REDIS LOCK
      // ===================================================

      if (acquiredLockKeys.length > 0) {
        await this.releaseBookingTableLocks(acquiredLockKeys);
      }

      throw error;
    }
  }

  private timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);

    if (
      Number.isNaN(hours) ||
      Number.isNaN(minutes) ||
      hours < 0 ||
      hours > 23 ||
      minutes < 0 ||
      minutes > 59
    ) {
      throw new BadRequestException('Thời gian phải có định dạng HH:mm');
    }

    return hours * 60 + minutes;
  }

  private minutesToTime(totalMinutes: number): string {
    const hours = Math.floor(totalMinutes / 60);

    const minutes = totalMinutes % 60;

    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}`;
  }

  //Lấy bàn có thể booking
  private async getRedisHeldTableIds(
    restaurantId: string,
    tableIds: Types.ObjectId[],
    bookingDate: Date,
    startTime: string,
    endTime: string,
  ): Promise<Set<string>> {
    const heldTableIds = new Set<string>();

    const date = bookingDate.toISOString().split('T')[0];

    for (const tableId of tableIds) {
      const tableIdString = tableId.toString();

      const pattern = `booking:hold:${restaurantId}:${tableIdString}:${date}:*`;

      const keys = await this.redisService.keys(pattern);

      for (const key of keys) {
        const keyTime = key.split(':').pop();

        if (!keyTime) {
          continue;
        }

        const [holdStartTime, holdEndTime] = keyTime.split('-');

        if (!holdStartTime || !holdEndTime) {
          continue;
        }

        const isOverlap = this.isTimeOverlap(
          startTime,
          endTime,
          holdStartTime,
          holdEndTime,
        );

        if (isOverlap) {
          heldTableIds.add(tableIdString);
          break;
        }
      }
    }

    return heldTableIds;
  }

  private isTimeOverlap(
    startA: string,
    endA: string,
    startB: string,
    endB: string,
  ): boolean {
    const startAMinutes = this.timeToMinutes(startA);

    const endAMinutes = this.timeToMinutes(endA);

    const startBMinutes = this.timeToMinutes(startB);

    const endBMinutes = this.timeToMinutes(endB);

    return startAMinutes < endBMinutes && endAMinutes > startBMinutes;
  }

  async getAvailableTables(restaurantId: string, dto: GetAvailableTablesDto) {
    await this.restaurantsService.getRestaurantById(restaurantId);

    const restaurantObjectId = new Types.ObjectId(restaurantId);

    const availabilities = await this.tableAvailabilityModel
      .find({
        restaurantId: restaurantObjectId,
      })
      .lean();

    if (availabilities.length === 0) {
      throw new NotFoundException(
        'Nhà hàng chưa được cấu hình lịch trống (availability)',
      );
    }

    const bookingDate = new Date(dto.date);

    if (isNaN(bookingDate.getTime())) {
      throw new BadRequestException('Định dạng ngày đặt bàn không hợp lệ');
    }

    const dayOfWeek = bookingDate.getDay();

    const requestedTime = dto.startTime;

    // =====================================================
    // 1. TÍNH END TIME THEO THỜI GIAN MẶC ĐỊNH CỦA NHÀ HÀNG
    // =====================================================

    const restaurant =
      await this.restaurantsService.getRestaurantById(restaurantId);

    const reservationDuration =
      restaurant.defaultReservationDurationMinutes ?? 120;

    const startMinutes = this.timeToMinutes(dto.startTime);

    const endMinutes = startMinutes + reservationDuration;

    if (endMinutes > 24 * 60) {
      return {
        restaurantId,
        date: dto.date,
        startTime: dto.startTime,
        endTime: null,
        dayOfWeek,
        guestCount: dto.guestCount,
        areas: [],
      };
    }

    const endTime = this.minutesToTime(endMinutes);

    // =====================================================
    // 2. TÌM BÀN CÓ AVAILABILITY
    // =====================================================

    const matchedTableIds: Types.ObjectId[] = [];

    for (const availability of availabilities) {
      let isTimeValid = false;

      const exception = availability.exceptions?.find((ex) => {
        const exDate = new Date(ex.date);

        return exDate.toISOString().slice(0, 10) === dto.date.slice(0, 10);
      });

      if (exception) {
        // Nhà hàng đóng cửa ngày này
        if (exception.isClosed) {
          continue;
        }

        // Phải bao phủ toàn bộ khoảng booking
        isTimeValid =
          exception.slots?.some(
            (slot) =>
              requestedTime >= slot.startTime && endTime <= slot.endTime,
          ) ?? false;
      } else {
        const weeklySlot = availability.weeklySlots?.find(
          (slot) => slot.dayOfWeek === dayOfWeek,
        );

        if (!weeklySlot || !weeklySlot.isActive) {
          continue;
        }

        // Phải bao phủ toàn bộ khoảng booking
        isTimeValid =
          weeklySlot.slots?.some(
            (slot) =>
              requestedTime >= slot.startTime && endTime <= slot.endTime,
          ) ?? false;
      }

      if (isTimeValid && availability.tableIds?.length) {
        matchedTableIds.push(...availability.tableIds);
      }
    }

    const uniqueTableIds = [
      ...new Set(matchedTableIds.map((id) => id.toString())),
    ].map((id) => new Types.ObjectId(id));

    if (uniqueTableIds.length === 0) {
      return {
        restaurantId,
        date: dto.date,
        startTime: dto.startTime,
        endTime,
        dayOfWeek,
        guestCount: dto.guestCount,
        areas: [],
      };
    }

    // =====================================================
    // 3. LẤY TABLE
    // =====================================================

    let tables = await this.tableModel
      .find({
        _id: {
          $in: uniqueTableIds,
        },

        restaurantId: restaurantObjectId,

        capacity: {
          $gte: dto.guestCount,
        },

        status: TableStatus.AVAILABLE,
      })
      .populate<{
        areaId: PopulatedArea;
      }>('areaId')
      .lean();

    // =====================================================
    // 4. CHECK BOOKING CONFLICT
    // =====================================================

    const conflictingBookings = await this.bookingModel
      .find({
        restaurantId: restaurantObjectId,

        bookingDate: {
          $gte: new Date(new Date(dto.date).setHours(0, 0, 0, 0)),

          $lt: new Date(new Date(dto.date).setHours(23, 59, 59, 999)),
        },

        tableIds: {
          $in: uniqueTableIds,
        },

        $or: [
          {
            depositStatus: DepositStatus.PAID,

            status: {
              $in: [
                BookingStatus.PENDING,
                BookingStatus.CONFIRMED,
                BookingStatus.CHECKED_IN,
              ],
            },
          },

          {
            depositStatus: DepositStatus.PENDING,

            paymentStatus: PaymentStatus.UNPAID,

            holdExpiresAt: {
              $gt: new Date(),
            },

            status: BookingStatus.PENDING,
          },

          {
            depositStatus: DepositStatus.NOT_REQUIRED,

            status: {
              $in: [BookingStatus.CONFIRMED, BookingStatus.CHECKED_IN],
            },
          },
        ],

        startTime: {
          $lt: endTime,
        },

        endTime: {
          $gt: requestedTime,
        },
      })
      .lean();

    const bookedTableIds = new Set(
      conflictingBookings.flatMap((booking) =>
        booking.tableIds.map((id) => id.toString()),
      ),
    );

    // =====================================================
    // 5. LOẠI BÀN ĐÃ CÓ BOOKING
    // =====================================================

    tables = tables.filter(
      (table) => !bookedTableIds.has(table._id.toString()),
    );

    // =====================================================
    // 6. TODO: LOẠI BÀN ĐANG BỊ REDIS HOLD
    // =====================================================

    const redisHeldTableIds = await this.getRedisHeldTableIds(
      restaurantId,
      tables.map((table) => table._id),
      bookingDate,
      requestedTime,
      endTime,
    );

    tables = tables.filter(
      (table) => !redisHeldTableIds.has(table._id.toString()),
    );

    // =====================================================
    // 7. GROUP BY AREA
    // =====================================================

    const groupedAreas = new Map<
      string,
      {
        area: Area;
        tables: typeof tables;
      }
    >();

    for (const table of tables) {
      const area = table.areaId;

      if (!area) {
        continue;
      }

      const areaId = area._id.toString();

      let group = groupedAreas.get(areaId);

      if (!group) {
        group = {
          area,
          tables: [],
        };

        groupedAreas.set(areaId, group);
      }

      group.tables.push(table);
    }

    return {
      restaurantId,
      date: dto.date,
      startTime: dto.startTime,
      endTime,
      dayOfWeek,
      guestCount: dto.guestCount,
      areas: Array.from(groupedAreas.values()),
    };
  }

  async findBookingDetail(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Định dạng ID đặt bàn không hợp lệ');
    }

    const booking = await this.bookingModel
      .findOne({
        _id: new Types.ObjectId(id),
      })
      .populate({
        path: 'userId',
        select: 'name email phone avatar role',
      })
      .populate({
        path: 'restaurantId',
        select: 'restaurantName address phone avatar rating',
      })
      .populate({
        path: 'tableIds',
        select: 'tableNumber capacity status areaId',
        populate: {
          path: 'areaId',
          select: 'name',
        },
      })
      .lean();

    if (!booking) {
      throw new NotFoundException('Không tìm thấy đặt bàn');
    }

    return booking;
  }

  async findOneBookingMe(id: string, userId: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Định dạng ID đặt bàn không hợp lệ');
    }

    if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestException('Định dạng ID người dùng không hợp lệ');
    }

    const booking = await this.bookingModel
      .findOne({
        _id: new Types.ObjectId(id),
        userId: new Types.ObjectId(userId),
      })
      .populate({
        path: 'userId',
        select: 'name email phone avatar role',
      })
      .populate({
        path: 'restaurantId',
        select: 'restaurantName address phone avatar rating',
      })
      .populate({
        path: 'tableIds',
        select: 'tableNumber capacity status areaId',
      })
      .lean();

    if (!booking) {
      throw new NotFoundException('Không tìm thấy đặt bàn');
    }

    return booking;
  }

  async findListById(userId: string) {
    if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestException('Định dạng ID người dùng không hợp lệ');
    }

    const bookings = await this.bookingModel
      .find({
        userId: new Types.ObjectId(userId),
      })
      .lean();

    if (!bookings) {
      throw new NotFoundException('Không tìm thấy đặt bàn');
    }

    return bookings;
  }

  async findUpcomingBookingsMe(userId: string) {
    if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestException('Định dạng ID người dùng không hợp lệ');
    }

    const today = dayjs().format('YYYY-MM-DD');

    const bookings = await this.bookingModel
      .find({
        userId: new Types.ObjectId(userId),

        bookingDate: {
          $gte: today,
        },

        status: {
          $in: [BookingStatus.PENDING, BookingStatus.CONFIRMED],
        },
      })
      .sort({
        bookingDate: 1,
        startTime: 1,
      })
      .populate({
        path: 'restaurantId',
        select:
          'name avatar restaurantName description rating images address slug',
      })
      .lean();

    return bookings;
  }

  async findRecentBookingsMe(userId: string) {
    if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestException('Định dạng ID người dùng không hợp lệ');
    }

    const bookings = await this.bookingModel
      .find({
        userId: new Types.ObjectId(userId),
        status: {
          $in: [
            BookingStatus.COMPLETED,
            BookingStatus.CANCELLED,
            BookingStatus.NO_SHOW,
          ],
        },
      })
      .sort({
        bookingDate: -1,
        startTime: -1,
      })
      .limit(3)
      .populate({
        path: 'restaurantId',
        select:
          'name avatar restaurantName description rating images address slug',
      })
      .lean();

    return bookings;
  }

  async findAllRestaurantBookings(
    userId: string,
    dto: FindRestaurantBookingDto,
  ) {
    const restaurant =
      await this.restaurantsService.getRestaurantByUserId(userId);

    const searchResult = await this.restaurantSearchService.search({
      restaurantId: restaurant._id.toString(),

      keyword: dto.keySearch,

      currentPage: dto.currentPage,

      pageSize: dto.pageSize,

      filter: {
        status: dto.status,

        paymentStatus: dto.paymentStatus,

        depositStatus: dto.depositStatus,

        fromDate: dto.fromDate,

        toDate: dto.toDate,
      },
    });

    return {
      data: searchResult.data,

      meta: {
        currentPage: dto.currentPage,
        pageSize: dto.pageSize,

        totalItems: searchResult.totalItems,

        totalPages: Math.ceil(searchResult.totalItems / dto.pageSize),
      },
    };
  }

  async findUpcomingRestaurantBookings(
    userId: string,
    dto: FindRestaurantBookingDto,
  ) {
    const restaurant =
      await this.restaurantsService.getRestaurantByUserId(userId);

    const searchResult = await this.restaurantSearchService.search({
      restaurantId: restaurant._id.toString(),

      keyword: dto.keySearch,

      currentPage: dto.currentPage,

      pageSize: dto.pageSize,

      filter: {
        status: dto.status,

        paymentStatus: dto.paymentStatus,

        depositStatus: dto.depositStatus,

        fromDate: dayjs().format('YYYY-MM-DD'),
      },

      sort: [
        {
          field: 'bookingDate',
          order: 'asc',
        },
      ],
    });

    return {
      data: searchResult.data,

      meta: {
        currentPage: dto.currentPage,
        pageSize: dto.pageSize,

        totalItems: searchResult.totalItems,

        totalPages: Math.ceil(searchResult.totalItems / dto.pageSize),
      },
    };
  }

  async bookingStatusCount(userId: string) {
    const restaurant =
      await this.restaurantsService.getRestaurantByUserId(userId);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const counts = await this.bookingModel.aggregate<BookingStatusAggregate>([
      {
        $match: {
          restaurantId: restaurant._id,
        },
      },
      {
        $facet: {
          status: [
            {
              $group: {
                _id: '$status',
                count: {
                  $sum: 1,
                },
              },
            },
          ],
          upcoming: [
            {
              $match: {
                bookingDate: {
                  $gte: today,
                },
              },
            },
            {
              $count: 'count',
            },
          ],
        },
      },
    ]);

    const result = {
      total: 0,
      upcoming: counts[0].upcoming[0]?.count ?? 0,
      pending: 0,
      confirmed: 0,
      completed: 0,
      cancelled: 0,
      rejected: 0,
      noShow: 0,
    };

    counts[0].status.forEach(({ _id, count }) => {
      result.total += count;

      switch (_id) {
        case BookingStatus.PENDING:
          result.pending = count;
          break;
        case BookingStatus.CONFIRMED:
          result.confirmed = count;
          break;
        case BookingStatus.COMPLETED:
          result.completed = count;
          break;
        case BookingStatus.CANCELLED:
          result.cancelled = count;
          break;
        case BookingStatus.REJECTED:
          result.rejected = count;
          break;
        case BookingStatus.NO_SHOW:
          result.noShow = count;
          break;
      }
    });

    return result;
  }

  findAll() {
    return `This action returns all bookings`;
  }

  update(id: number, updateBookingDto: UpdateBookingDto) {
    return `This action updates a #${id} booking`;
  }

  remove(id: number) {
    return `This action removes a #${id} booking`;
  }
}
