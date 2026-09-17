import {
  BadRequestException,
  ConflictException,
  Injectable,
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
import {
  TableAvailability,
  TableAvailabilityDocument,
} from '../../table-availabilities/schemas/table-availability.schema';
import { Table, TableDocument, TableStatus } from '../../tables/schemas/table.schema';

@Injectable()
export class BookingValidationService {
  constructor(
    @InjectModel(Booking.name)
    private readonly bookingModel: Model<BookingDocument>,
    @InjectModel(TableAvailability.name)
    private readonly tableAvailabilityModel: Model<TableAvailabilityDocument>,
    @InjectModel(Table.name)
    private readonly tableModel: Model<TableDocument>,
  ) {}

  async validateTableAvailability(
    restaurantId: Types.ObjectId,
    bookingDate: Date,
    startTime: string,
    endTime: string,
    tableIds: Types.ObjectId[],
  ): Promise<void> {
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

      if (exception) {
        if (exception.isClosed) {
          continue;
        }

        isTimeValid =
          exception.slots?.some(
            (slot) => startTime >= slot.startTime && endTime <= slot.endTime,
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
            (slot) => startTime >= slot.startTime && endTime <= slot.endTime,
          ) ?? false;
      }

      if (isTimeValid && availability.tableIds?.length) {
        for (const tableId of availability.tableIds) {
          availableTableIds.add(tableId.toString());
        }
      }
    }

    const unavailableTableIds = tableIds.filter(
      (tableId) => !availableTableIds.has(tableId.toString()),
    );

    if (unavailableTableIds.length > 0) {
      throw new ConflictException(
        'Một hoặc nhiều bàn không hoạt động trong khung giờ đã chọn',
      );
    }
  }

  async validateBookingConflict(
    restaurantId: Types.ObjectId,
    bookingDate: Date,
    startTime: string,
    endTime: string,
    tableIds: Types.ObjectId[],
  ): Promise<void> {
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
            $gt: now,
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
        $gt: startTime,
      },
    });

    if (conflictingBookings.length > 0) {
      throw new ConflictException(
        'Một hoặc nhiều bàn đã được đặt trong khoảng thời gian này',
      );
    }
  }

  validateTablesAndCapacity(
    tables: TableDocument[] | any[],
    requestedTableIds: string[],
    guestCount: number,
  ): void {
    if (tables.length !== requestedTableIds.length) {
      throw new BadRequestException(
        'Một hoặc nhiều bàn không tồn tại hoặc không thuộc nhà hàng',
      );
    }

    const unavailableTable = tables.find(
      (table) => table.status !== TableStatus.AVAILABLE,
    );

    if (unavailableTable) {
      throw new ConflictException('Một hoặc nhiều bàn hiện không khả dụng');
    }

    const totalCapacity = (tables as Array<{ capacity?: number }>).reduce(
      (total: number, table) => total + (table.capacity ?? 0),
      0,
    );

    if (totalCapacity < guestCount) {
      throw new BadRequestException(
        `Tổng sức chứa của các bàn không đủ cho ${guestCount} khách`,
      );
    }
  }
}
