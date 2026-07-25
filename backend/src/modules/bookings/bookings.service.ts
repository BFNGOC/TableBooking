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

@Injectable()
export class BookingsService {
  constructor(
    @InjectModel(Booking.name)
    private readonly bookingModel: Model<BookingDocument>,
    @InjectModel(Table.name)
    private readonly tableModel: Model<TableDocument>,
    @Inject(forwardRef(() => RestaurantsService))
    private readonly restaurantsService: RestaurantsService,
  ) {}

  async createBooking(
    restaurantId: string,
    userId: string,
    dto: CreateBookingDto,
  ) {
    const startMinutes = this.timeToMinutes(dto.startTime);
    const endMinutes = this.timeToMinutes(dto.endTime);

    if (startMinutes >= endMinutes) {
      throw new BadRequestException(
        'Thời gian kết thúc phải sau thời gian bắt đầu',
      );
    }

    const bookingDate = new Date(dto.bookingDate);
    if (isNaN(bookingDate.getTime())) {
      throw new BadRequestException('Ngày đặt bàn không hợp lệ');
    }

    // 1. Check restaurant
    const restaurant =
      await this.restaurantsService.getRestaurantById(restaurantId);
    if (!restaurant) {
      throw new NotFoundException('Không tìm thấy nhà hàng');
    }

    const restaurantObjectId = new Types.ObjectId(restaurantId);

    // 2. Convert table IDs
    const tableObjectIds = dto.tableIds.map((id) => new Types.ObjectId(id));

    // 3. Check tables
    const tables = await this.tableModel
      .find({
        _id: { $in: tableObjectIds },
        restaurantId: restaurantObjectId,
      })
      .lean();

    if (tables.length !== dto.tableIds.length) {
      throw new BadRequestException(
        'Một hoặc nhiều bàn không tồn tại hoặc không thuộc nhà hàng',
      );
    }

    // 4. Check table status
    const unavailableTable = tables.find(
      (table) => table.status !== TableStatus.AVAILABLE,
    );
    if (unavailableTable) {
      throw new ConflictException('Một hoặc nhiều bàn hiện không khả dụng');
    }

    // 5. Check capacity
    const totalCapacity = tables.reduce(
      (total, table) => total + table.capacity,
      0,
    );
    if (totalCapacity < dto.guestCount) {
      throw new BadRequestException(
        'Tổng sức chứa của các bàn không đủ số lượng khách',
      );
    }

    // 6. Check booking conflict
    const startOfDay = new Date(bookingDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(bookingDate);
    endOfDay.setHours(23, 59, 59, 999);

    const conflictingBookings = await this.bookingModel.find({
      restaurantId: restaurantObjectId,
      bookingDate: {
        $gte: startOfDay,
        $lt: endOfDay,
      },
      tableIds: {
        $in: tableObjectIds,
      },
      $or: [
        // Booking đã thanh toán cọc
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

        // Booking đang chờ thanh toán nhưng còn thời gian hold
        {
          depositStatus: DepositStatus.PENDING,
          paymentStatus: PaymentStatus.UNPAID,
          holdExpiresAt: {
            $gt: new Date(),
          },
          status: {
            $in: [BookingStatus.PENDING, BookingStatus.CONFIRMED],
          },
        },

        // Nhà hàng không yêu cầu cọc
        {
          depositStatus: DepositStatus.NOT_REQUIRED,
          status: {
            $in: [BookingStatus.CONFIRMED, BookingStatus.CHECKED_IN],
          },
        },
      ],
      startTime: {
        $lt: dto.endTime,
      },
      endTime: {
        $gt: dto.startTime,
      },
    });

    if (conflictingBookings.length > 0) {
      throw new ConflictException(
        'Một hoặc nhiều bàn đã được đặt trong khoảng thời gian này',
      );
    }

    // 7. Create booking
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
      endTime: dto.endTime,
      paymentStatus: PaymentStatus.UNPAID,
    });

    return booking;
  }

  private timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }

  findAll() {
    return `This action returns all bookings`;
  }

  findOne(id: number) {
    return `This action returns a #${id} booking`;
  }

  update(id: number, updateBookingDto: UpdateBookingDto) {
    return `This action updates a #${id} booking`;
  }

  remove(id: number) {
    return `This action removes a #${id} booking`;
  }
}
