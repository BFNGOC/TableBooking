import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Booking,
  BookingDocument,
  BookingStatus,
} from '../bookings/schemas/booking.schema';
import {
  Payment,
  PaymentDocument,
  PaymentTransactionStatus,
} from '../payment/schemas/payment.schema';
import { User, UserDocument } from '../users/schemas/user.schema';
import { Table, TableDocument } from '../tables/schemas/table.schema';
import { Model } from 'mongoose';
import { Types } from 'mongoose';
import { RestaurantsService } from '../restaurants/restaurants.service';
import { BookingQueryService } from '../bookings/services/booking-query.service';
import { StatisticsQueryDto } from './dto/analytic-query.dto';
import { getStatisticsDateRange } from '@app/helpers/util';

@Injectable()
export class StatisticsService {
  constructor(
    @InjectModel(Booking.name)
    private readonly bookingModel: Model<BookingDocument>,

    @InjectModel(Payment.name)
    private readonly paymentModel: Model<PaymentDocument>,

    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,

    @InjectModel(Table.name)
    private readonly tableModel: Model<TableDocument>,

    private readonly restaurantsService: RestaurantsService,

    private readonly bookingQueryService: BookingQueryService,
  ) {}

  async getStatistics(userId: string, query: StatisticsQueryDto) {
    const restaurant =
      await this.restaurantsService.getRestaurantByUserId(userId);

    const { startDate, endDate } = getStatisticsDateRange(query);

    const [
      overview,
      bookingTrend,
      revenueTrend,
      bookingStatus,
      popularBookingHours,
      tablePerformance,
    ] = await Promise.all([
      this.getOverviewStats(restaurant._id, startDate, endDate),
      this.getBookingTrend(restaurant._id, startDate, endDate),
      this.getRevenueTrend(restaurant._id, startDate, endDate),
      this.getBookingStatus(restaurant._id, startDate, endDate),
      this.getPopularBookingHours(restaurant._id, startDate, endDate),
      this.getTablePerformance(restaurant._id, startDate, endDate),
    ]);

    return {
      overview,
      bookingTrend,
      revenueTrend,
      bookingStatus,
      popularBookingHours,
      tablePerformance,
    };
  }

  private calculateChange(current: number, previous: number) {
    const difference = current - previous;

    if (previous === 0) {
      return {
        difference,
        percentage: current === 0 ? 0 : 100,
      };
    }

    return {
      difference,
      percentage: Number(((difference / previous) * 100).toFixed(2)),
    };
  }

  private getPreviousDateRange(startDate: Date, endDate: Date) {
    const duration = endDate.getTime() - startDate.getTime();
    const previousEndDate = new Date(startDate.getTime() - 1);

    return {
      startDate: new Date(previousEndDate.getTime() - duration),
      endDate: previousEndDate,
    };
  }

  private async getOverviewPeriodStats(
    restaurantId: Types.ObjectId,
    startDate: Date,
    endDate: Date,
  ) {
    const bookingDateMatch = {
      restaurantId,
      createdAt: { $gte: startDate, $lte: endDate },
    };

    const [bookingStats, revenueStats, newCustomerStats] = await Promise.all([
      this.bookingModel.aggregate([
        { $match: bookingDateMatch },
        {
          $group: {
            _id: null,
            totalBookings: { $sum: 1 },
            cancelledBookings: {
              $sum: {
                $cond: [{ $eq: ['$status', BookingStatus.CANCELLED] }, 1, 0],
              },
            },
          },
        },
      ]),
      this.paymentModel.aggregate([
        {
          $match: {
            restaurantId,
            status: PaymentTransactionStatus.PAID,
            createdAt: { $gte: startDate, $lte: endDate },
          },
        },
        { $sort: { createdAt: -1, _id: -1 } },
        {
          $group: {
            _id: { bookingId: '$bookingId', type: '$type' },
            amount: { $first: '$amount' },
            refundedAmount: { $first: { $ifNull: ['$refundedAmount', 0] } },
          },
        },
        {
          $group: {
            _id: null,
            total: {
              $sum: {
                $max: [{ $subtract: ['$amount', '$refundedAmount'] }, 0],
              },
            },
          },
        },
      ]),
      this.paymentModel.aggregate([
        {
          $match: {
            restaurantId,
            status: PaymentTransactionStatus.PAID,
            createdAt: { $gte: startDate, $lte: endDate },
          },
        },
        { $sort: { createdAt: -1, _id: -1 } },
        {
          $group: {
            _id: '$userId',
            netAmount: {
              $first: {
                $max: [
                  {
                    $subtract: ['$amount', { $ifNull: ['$refundedAmount', 0] }],
                  },
                  0,
                ],
              },
            },
          },
        },
        { $match: { netAmount: { $gt: 0 } } },
        {
          $lookup: {
            from: 'users',
            localField: '_id',
            foreignField: '_id',
            as: 'customer',
          },
        },
        { $unwind: '$customer' },
        {
          $match: {
            'customer.createdAt': { $gte: startDate, $lte: endDate },
          },
        },
        { $count: 'total' },
      ]),
    ]);

    const totalBookings = bookingStats[0]?.totalBookings ?? 0;
    const cancelledBookings = bookingStats[0]?.cancelledBookings ?? 0;

    return {
      totalBookings,
      estimatedRevenue: revenueStats[0]?.total ?? 0,
      newCustomers: newCustomerStats[0]?.total ?? 0,
      cancellationRate:
        totalBookings === 0
          ? 0
          : Number(((cancelledBookings / totalBookings) * 100).toFixed(2)),
    };
  }

  private async getOverviewStats(
    restaurantId: Types.ObjectId,
    startDate: Date,
    endDate: Date,
  ) {
    const previousRange = this.getPreviousDateRange(startDate, endDate);
    const [current, previous] = await Promise.all([
      this.getOverviewPeriodStats(restaurantId, startDate, endDate),
      this.getOverviewPeriodStats(
        restaurantId,
        previousRange.startDate,
        previousRange.endDate,
      ),
    ]);

    return {
      totalBookings: {
        current: current.totalBookings,
        previous: previous.totalBookings,
        change: this.calculateChange(
          current.totalBookings,
          previous.totalBookings,
        ),
      },
      estimatedRevenue: {
        current: current.estimatedRevenue,
        previous: previous.estimatedRevenue,
        change: this.calculateChange(
          current.estimatedRevenue,
          previous.estimatedRevenue,
        ),
      },
      newCustomers: {
        current: current.newCustomers,
        previous: previous.newCustomers,
        change: this.calculateChange(
          current.newCustomers,
          previous.newCustomers,
        ),
      },
      cancellationRate: {
        current: current.cancellationRate,
        previous: previous.cancellationRate,
        change: this.calculateChange(
          current.cancellationRate,
          previous.cancellationRate,
        ),
      },
    };
  }

  private formatStatisticsDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  private getStatisticsDates(startDate: Date, endDate: Date): string[] {
    const dates: string[] = [];
    const date = new Date(startDate);
    date.setHours(0, 0, 0, 0);

    const lastDate = new Date(endDate);
    lastDate.setHours(0, 0, 0, 0);

    while (date <= lastDate) {
      dates.push(this.formatStatisticsDate(date));
      date.setDate(date.getDate() + 1);
    }

    return dates;
  }

  private async getBookingTrend(
    restaurantId: Types.ObjectId,
    startDate: Date,
    endDate: Date,
  ) {
    const result = await this.bookingModel.aggregate([
      {
        $match: {
          restaurantId,
          createdAt: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: '%Y-%m-%d',
              date: '$createdAt',
              timezone: 'Asia/Ho_Chi_Minh',
            },
          },
          value: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const values = new Map<string, number>(
      result.map((item) => [item._id, item.value]),
    );

    return this.getStatisticsDates(startDate, endDate).map((date) => ({
      date,
      value: values.get(date) ?? 0,
    }));
  }

  private async getRevenueTrend(
    restaurantId: Types.ObjectId,
    startDate: Date,
    endDate: Date,
  ) {
    const result = await this.paymentModel.aggregate([
      {
        $match: {
          restaurantId,
          status: PaymentTransactionStatus.PAID,
          createdAt: { $gte: startDate, $lte: endDate },
        },
      },
      { $sort: { createdAt: -1, _id: -1 } },
      {
        $group: {
          _id: { bookingId: '$bookingId', type: '$type' },
          createdAt: { $first: '$createdAt' },
          amount: { $first: { $ifNull: ['$amount', 0] } },
          refundedAmount: { $first: { $ifNull: ['$refundedAmount', 0] } },
        },
      },
      {
        $project: {
          createdAt: 1,
          value: {
            $max: [{ $subtract: ['$amount', '$refundedAmount'] }, 0],
          },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: '%Y-%m-%d',
              date: '$createdAt',
              timezone: 'Asia/Ho_Chi_Minh',
            },
          },
          value: { $sum: '$value' },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const values = new Map<string, number>(
      result.map((item) => [item._id, item.value]),
    );

    return this.getStatisticsDates(startDate, endDate).map((date) => ({
      date,
      value: values.get(date) ?? 0,
    }));
  }

  private async getBookingStatus(
    restaurantId: Types.ObjectId,
    startDate: Date,
    endDate: Date,
  ) {
    const result = await this.bookingModel.aggregate([
      {
        $match: {
          restaurantId,
          createdAt: { $gte: startDate, $lte: endDate },
        },
      },
      { $group: { _id: '$status', value: { $sum: 1 } } },
    ]);

    const values = new Map<string, number>(
      result.map((item) => [item._id, item.value]),
    );

    return Object.values(BookingStatus).map((status) => ({
      status,
      value: values.get(status) ?? 0,
    }));
  }

  private async getPopularBookingHours(
    restaurantId: Types.ObjectId,
    startDate: Date,
    endDate: Date,
  ) {
    const result = await this.bookingModel.aggregate([
      {
        $match: {
          restaurantId,
          createdAt: { $gte: startDate, $lte: endDate },
          status: { $nin: [BookingStatus.REJECTED, BookingStatus.CANCELLED] },
        },
      },
      {
        $project: {
          hour: {
            $convert: {
              input: { $substrBytes: ['$startTime', 0, 2] },
              to: 'int',
              onError: null,
              onNull: null,
            },
          },
        },
      },
      { $match: { hour: { $ne: null, $gte: 0, $lte: 23 } } },
      { $group: { _id: '$hour', value: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);

    return result.map((item) => ({
      hour: item._id,
      value: item.value,
    }));
  }

  private async getTablePerformance(
    restaurantId: Types.ObjectId,
    startDate: Date,
    endDate: Date,
  ) {
    return this.tableModel.aggregate([
      { $match: { restaurantId } },
      {
        $lookup: {
          from: 'bookings',
          let: { tableId: '$_id' },
          pipeline: [
            {
              $match: {
                restaurantId,
                createdAt: { $gte: startDate, $lte: endDate },
                $expr: { $in: ['$$tableId', '$tableIds'] },
              },
            },
            { $count: 'total' },
          ],
          as: 'bookings',
        },
      },
      {
        $project: {
          _id: 0,
          tableId: '$_id',
          tableName: '$tableNumber',
          bookingCount: {
            $ifNull: [{ $arrayElemAt: ['$bookings.total', 0] }, 0],
          },
        },
      },
      { $sort: { bookingCount: -1, tableName: 1 } },
    ]);
  }
}
