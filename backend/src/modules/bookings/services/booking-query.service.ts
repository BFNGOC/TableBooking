import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import dayjs from 'dayjs';
import {
  Booking,
  BookingDocument,
  BookingStatus,
  DepositStatus,
  PaymentStatus,
} from '../schemas/booking.schema';
import {
  Table,
  TableDocument,
  TableStatus,
} from '../../tables/schemas/table.schema';
import {
  TableAvailability,
  TableAvailabilityDocument,
} from '../../table-availabilities/schemas/table-availability.schema';
import { Area } from '../../areas/schemas/area.schema';
import { RestaurantsService } from '../../restaurants/restaurants.service';
import { RestaurantBookingSearchService } from '../booking-restaurant-search.service';
import { BookingLockService } from './booking-lock.service';
import { GetAvailableTablesDto } from '../dto/get-available-tables.dto';
import { FindRestaurantBookingDto } from '../dto/find-restaurant.dto';
import { CheckInBookingDto } from '../dto/check-in.dto';
import { minutesToTime, timeToMinutes } from '../utils/booking-time.util';

type PopulatedArea = Area & {
  _id: Types.ObjectId;
};

@Injectable()
export class BookingQueryService {
  constructor(
    @InjectModel(Booking.name)
    private readonly bookingModel: Model<BookingDocument>,
    @InjectModel(Table.name)
    private readonly tableModel: Model<TableDocument>,
    @InjectModel(TableAvailability.name)
    private readonly tableAvailabilityModel: Model<TableAvailabilityDocument>,
    @Inject(forwardRef(() => RestaurantsService))
    private readonly restaurantsService: RestaurantsService,
    private readonly restaurantSearchService: RestaurantBookingSearchService,
    private readonly bookingLockService: BookingLockService,
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

  async getAvailableTables(restaurantId: string, dto: GetAvailableTablesDto) {
    await this.restaurantsService.getRestaurantById(restaurantId);
    const restaurantObjectId = new Types.ObjectId(restaurantId);

    const availabilities = await this.tableAvailabilityModel
      .find({ restaurantId: restaurantObjectId })
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

    const restaurant =
      await this.restaurantsService.getRestaurantById(restaurantId);
    const reservationDuration =
      restaurant.defaultReservationDurationMinutes ?? 120;

    const startMinutes = timeToMinutes(dto.startTime);
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

    const endTime = minutesToTime(endMinutes);

    const matchedTableIds: Types.ObjectId[] = [];
    for (const availability of availabilities) {
      let isTimeValid = false;
      const exception = availability.exceptions?.find((ex) => {
        const exDate = new Date(ex.date);
        return exDate.toISOString().slice(0, 10) === dto.date.slice(0, 10);
      });

      if (exception) {
        if (exception.isClosed) {
          continue;
        }
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

    let tables = await this.tableModel
      .find({
        _id: { $in: uniqueTableIds },
        restaurantId: restaurantObjectId,
        capacity: { $gte: dto.guestCount },
        status: TableStatus.AVAILABLE,
      })
      .populate<{ areaId: PopulatedArea }>('areaId')
      .lean();

    const conflictingBookings = await this.bookingModel
      .find({
        restaurantId: restaurantObjectId,
        bookingDate: {
          $gte: new Date(new Date(dto.date).setHours(0, 0, 0, 0)),
          $lt: new Date(new Date(dto.date).setHours(23, 59, 59, 999)),
        },
        tableIds: { $in: uniqueTableIds },
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
            holdExpiresAt: { $gt: new Date() },
            status: BookingStatus.PENDING,
          },
          {
            depositStatus: DepositStatus.NOT_REQUIRED,
            status: {
              $in: [BookingStatus.CONFIRMED, BookingStatus.CHECKED_IN],
            },
          },
        ],
        startTime: { $lt: endTime },
        endTime: { $gt: requestedTime },
      })
      .lean();

    const bookedTableIds = new Set(
      conflictingBookings.flatMap((booking) =>
        booking.tableIds.map((id) => id.toString()),
      ),
    );

    tables = tables.filter(
      (table) => !bookedTableIds.has(table._id.toString()),
    );

    const redisHeldTableIds =
      await this.bookingLockService.getRedisHeldTableIds(
        restaurantId,
        tables.map((table) => table._id),
        bookingDate,
        requestedTime,
        endTime,
      );

    tables = tables.filter(
      (table) => !redisHeldTableIds.has(table._id.toString()),
    );

    const groupedAreas = new Map<
      string,
      { area: Area; tables: typeof tables }
    >();

    for (const table of tables) {
      const area = table.areaId;
      if (!area) {
        continue;
      }

      const areaId = area._id.toString();
      let group = groupedAreas.get(areaId);

      if (!group) {
        group = { area, tables: [] };
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
      .findOne({ _id: new Types.ObjectId(id) })
      .populate({
        path: 'userId',
        select: 'name email phone avatar role',
      })
      .populate({
        path: 'restaurantId',
        select: 'restaurantName address phone avatar rating slug',
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
        select: 'restaurantName address phone avatar rating slug',
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
      .find({ userId: new Types.ObjectId(userId) })
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

    return this.bookingModel
      .find({
        userId: new Types.ObjectId(userId),
        bookingDate: { $gte: today },
      })
      .sort({ bookingDate: 1, startTime: 1 })
      .populate({
        path: 'restaurantId',
        select:
          'name avatar restaurantName description rating images address slug',
      })
      .lean();
  }

  async findRecentBookingsMe(userId: string) {
    if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestException('Định dạng ID người dùng không hợp lệ');
    }

    return this.bookingModel
      .find({ userId: new Types.ObjectId(userId) })
      .sort({ bookingDate: -1, startTime: -1 })
      .limit(3)
      .populate({
        path: 'restaurantId',
        select:
          'name avatar restaurantName description rating images address slug',
      })
      .lean();
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
      sort: [{ field: 'bookingDate', order: 'asc' }],
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

    const now = new Date();

    const createEmptyCount = () => ({
      total: 0,
      pending: 0,
      confirmed: 0,
      checkedIn: 0,
      completed: 0,
      cancelled: 0,
      rejected: 0,
      noShow: 0,
    });

    const counts = await this.bookingModel.aggregate([
      { $match: { restaurantId: restaurant._id } },
      {
        $facet: {
          all: [{ $group: { _id: '$status', count: { $sum: 1 } } }],
          upcoming: [
            {
              $match: {
                $expr: {
                  $gt: [
                    {
                      $dateFromString: {
                        dateString: {
                          $concat: [
                            {
                              $dateToString: {
                                date: '$bookingDate',
                                format: '%Y-%m-%d',
                              },
                            },
                            'T',
                            '$startTime',
                            ':00',
                          ],
                        },
                      },
                    },
                    now,
                  ],
                },
              },
            },
            { $group: { _id: '$status', count: { $sum: 1 } } },
          ],
        },
      },
    ]);

    const mapStatusCount = (data: { _id: BookingStatus; count: number }[]) => {
      const result = createEmptyCount();
      data.forEach(({ _id, count }) => {
        result.total += count;
        switch (_id) {
          case BookingStatus.PENDING:
            result.pending = count;
            break;
          case BookingStatus.CONFIRMED:
            result.confirmed = count;
            break;
          case BookingStatus.CHECKED_IN:
            result.checkedIn = count;
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
    };

    return {
      all: mapStatusCount(counts[0].all),
      upcoming: mapStatusCount(counts[0].upcoming),
    };
  }

  async verifyCheckInBooking(dto: CheckInBookingDto, userId: string) {
    if (!dto.checkInToken && !dto.checkInCode) {
      throw new BadRequestException('Vui lòng cung cấp mã QR hoặc mã check-in');
    }

    if (dto.checkInToken && dto.checkInCode) {
      throw new BadRequestException('Chỉ được cung cấp mã QR hoặc mã check-in');
    }

    if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestException('Định dạng user ID không hợp lệ');
    }

    const restaurant =
      await this.restaurantsService.getRestaurantByUserId(userId);

    if (!restaurant) {
      throw new NotFoundException('Không tìm thấy nhà hàng của tài khoản này');
    }

    const query = dto.checkInToken
      ? { checkInToken: dto.checkInToken, restaurantId: restaurant._id }
      : { checkInCode: dto.checkInCode, restaurantId: restaurant._id };

    const booking = await this.bookingModel
      .findOne(query)
      .populate('tableIds', 'tableNumber capacity')
      .lean();

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

    return {
      _id: booking._id,
      status: booking.status,
      contactName: booking.contactName,
      contactPhone: booking.contactPhone,
      guestCount: booking.guestCount,
      bookingDate: booking.bookingDate,
      startTime: booking.startTime,
      endTime: booking.endTime,
      tables: booking.tableIds,
      checkInCode: booking.checkInCode,
      paymentStatus: booking.paymentStatus,
      depositStatus: booking.depositStatus,
      depositAmount: booking.depositAmount,
      customerNote: booking.customerNote,
      pricingSnapshot: booking.pricingSnapshot,
    };
  }
}
