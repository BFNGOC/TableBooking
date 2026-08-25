import { Injectable } from '@nestjs/common';
import { BookingsService } from '../bookings/bookings.service';
import { PaymentService } from '../payment/payment.service';
import { Model, Types } from 'mongoose';
import { RestaurantsService } from '../restaurants/restaurants.service';
import { InjectModel } from '@nestjs/mongoose';
import {
  Booking,
  BookingDocument,
  BookingStatus,
  PaymentStatus,
} from '../bookings/schemas/booking.schema';
import {
  Payment,
  PaymentDocument,
  PaymentTransactionStatus,
} from '../payment/schemas/payment.schema';
import { DateRange, getMonthRange, getWeekRange } from '@app/helpers/util';
import { DashboardPeriod } from './types/dashboard-type';
import { FindRestaurantBookingDto } from '../bookings/dto/find-restaurant.dto';
import { BookingQueryService } from '../bookings/services/booking-query.service';

@Injectable()
export class DashboardService {
  constructor(
    @InjectModel(Booking.name)
    private readonly bookingModel: Model<BookingDocument>,

    @InjectModel(Payment.name)
    private readonly paymentModel: Model<PaymentDocument>,

    private readonly restaurantsService: RestaurantsService,

    private readonly bookingQueryService: BookingQueryService,
  ) {}

  async getDashboardData(
    userId: string,
    period: DashboardPeriod = DashboardPeriod.WEEK,
  ) {
    const restaurant =
      await this.restaurantsService.getRestaurantByUserId(userId);

    const currentMonth = getMonthRange(0);
    const previousMonth = getMonthRange(-1);

    const [
      bookingStats,
      revenueStats,
      payingCustomerStats,
      cancellationStats,
      bookingTrend,
      bookingStatusStats,
      upcomingBookings,
    ] = await Promise.all([
      this.getBookingStats(restaurant._id, currentMonth, previousMonth),
      this.getRevenueStats(restaurant._id, currentMonth, previousMonth),
      this.getPayingCustomerStats(restaurant._id, currentMonth, previousMonth),
      this.getCancellationStats(restaurant._id, currentMonth, previousMonth),
      this.getBookingTrend(restaurant._id, period),
      this.getBookingStatusStats(
        restaurant._id,
        currentMonth.startDate,
        currentMonth.endDate,
      ),
      this.getUpcomingBookings(userId),
    ]);

    return {
      booking: bookingStats,
      revenue: revenueStats,
      payingCustomer: payingCustomerStats,
      cancellation: cancellationStats,
      bookingTrend,
      bookingStatus: bookingStatusStats,
      upcomingBookings,
    };
  }

  private calculatePercentageChange(
    current: number,
    previous: number,
  ): {
    difference: number;
    percentage: number;
  } {
    const difference = current - previous;

    if (previous === 0) {
      return {
        difference,
        percentage: 0,
      };
    }

    const percentage = Number(((difference / previous) * 100).toFixed(2));

    return {
      difference,
      percentage,
    };
  }

  private async getRevenue(
    restaurantId: Types.ObjectId,
    startDate: Date,
    endDate: Date,
  ): Promise<number> {
    const result = await this.paymentModel.aggregate([
      {
        $match: {
          restaurantId,
          status: PaymentStatus.PAID,
          createdAt: {
            $gte: startDate,
            $lt: endDate,
          },
        },
      },
      {
        $group: {
          _id: null,
          total: {
            $sum: '$amount',
          },
        },
      },
    ]);

    return result[0]?.total ?? 0;
  }

  private async getPayingCustomers(
    restaurantId: Types.ObjectId,
    startDate: Date,
    endDate: Date,
  ): Promise<number> {
    const users = await this.paymentModel.distinct('userId', {
      restaurantId,
      status: PaymentTransactionStatus.PAID,
      createdAt: {
        $gte: startDate,
        $lt: endDate,
      },
    });

    return users.length;
  }

  private async getNewCustomers(
    restaurantId: Types.ObjectId,
    startDate: Date,
    endDate: Date,
  ): Promise<number> {
    const result = await this.paymentModel.aggregate([
      // 1. Lấy payment thành công trong tháng
      {
        $match: {
          restaurantId,
          status: PaymentTransactionStatus.PAID,
          createdAt: {
            $gte: startDate,
            $lt: endDate,
          },
        },
      },

      // 2. Gom unique user
      {
        $group: {
          _id: '$userId',
        },
      },

      // 3. Kiểm tra user này có payment thành công trước tháng này không
      {
        $lookup: {
          from: 'payments',
          let: {
            userId: '$_id',
          },
          pipeline: [
            {
              $match: {
                restaurantId,
                status: PaymentTransactionStatus.PAID,
                createdAt: {
                  $lt: startDate,
                },
                $expr: {
                  $eq: ['$userId', '$$userId'],
                },
              },
            },
            {
              $limit: 1,
            },
          ],
          as: 'previousPayments',
        },
      },

      // 4. Chỉ giữ user chưa từng thanh toán trước đó
      {
        $match: {
          previousPayments: {
            $size: 0,
          },
        },
      },

      // 5. Đếm
      {
        $count: 'total',
      },
    ]);

    return result[0]?.total ?? 0;
  }

  private async getCancellationRate(
    restaurantId: Types.ObjectId,
    startDate: Date,
    endDate: Date,
  ): Promise<number> {
    const [total, cancelled] = await Promise.all([
      this.bookingModel.countDocuments({
        restaurantId,
        createdAt: {
          $gte: startDate,
          $lt: endDate,
        },
      }),

      this.bookingModel.countDocuments({
        restaurantId,
        status: BookingStatus.CANCELLED,
        createdAt: {
          $gte: startDate,
          $lt: endDate,
        },
      }),
    ]);

    if (total === 0) {
      return 0;
    }

    return Number(((cancelled / total) * 100).toFixed(2));
  }

  private async getBookingStats(
    restaurantId: Types.ObjectId,
    currentMonth: DateRange,
    previousMonth: DateRange,
  ) {
    const [current, previous] = await Promise.all([
      this.bookingModel.countDocuments({
        restaurantId,
        createdAt: {
          $gte: currentMonth.startDate,
          $lt: currentMonth.endDate,
        },
      }),

      this.bookingModel.countDocuments({
        restaurantId,
        createdAt: {
          $gte: previousMonth.startDate,
          $lt: previousMonth.endDate,
        },
      }),
    ]);

    return {
      current,
      previous,
      change: this.calculatePercentageChange(current, previous),
    };
  }

  private async getRevenueStats(
    restaurantId: Types.ObjectId,
    currentMonth: DateRange,
    previousMonth: DateRange,
  ) {
    const [current, previous] = await Promise.all([
      this.getRevenue(
        restaurantId,
        currentMonth.startDate,
        currentMonth.endDate,
      ),

      this.getRevenue(
        restaurantId,
        previousMonth.startDate,
        previousMonth.endDate,
      ),
    ]);

    return {
      current,
      previous,
      change: this.calculatePercentageChange(current, previous),
    };
  }

  private async getNewCustomerStats(
    restaurantId: Types.ObjectId,
    currentMonth: DateRange,
    previousMonth: DateRange,
  ) {
    const [current, previous] = await Promise.all([
      this.getNewCustomers(
        restaurantId,
        currentMonth.startDate,
        currentMonth.endDate,
      ),

      this.getNewCustomers(
        restaurantId,
        previousMonth.startDate,
        previousMonth.endDate,
      ),
    ]);

    return {
      current,
      previous,
      change: this.calculatePercentageChange(current, previous),
    };
  }

  private async getPayingCustomerStats(
    restaurantId: Types.ObjectId,
    currentMonth: DateRange,
    previousMonth: DateRange,
  ) {
    const [current, previous] = await Promise.all([
      this.getPayingCustomers(
        restaurantId,
        currentMonth.startDate,
        currentMonth.endDate,
      ),

      this.getPayingCustomers(
        restaurantId,
        previousMonth.startDate,
        previousMonth.endDate,
      ),
    ]);

    return {
      current,
      previous,
      change: this.calculatePercentageChange(current, previous),
    };
  }

  private async getCancellationStats(
    restaurantId: Types.ObjectId,
    currentMonth: DateRange,
    previousMonth: DateRange,
  ) {
    const [current, previous] = await Promise.all([
      this.getCancellationRate(
        restaurantId,
        currentMonth.startDate,
        currentMonth.endDate,
      ),

      this.getCancellationRate(
        restaurantId,
        previousMonth.startDate,
        previousMonth.endDate,
      ),
    ]);

    return {
      current,
      previous,
      change: this.calculatePercentageChange(current, previous),
    };
  }

  private async getBookingTrend(
    restaurantId: Types.ObjectId,
    period: DashboardPeriod,
  ) {
    const { startDate, endDate } =
      period === DashboardPeriod.WEEK ? getWeekRange() : getMonthRange();

    const result = await this.bookingModel.aggregate([
      {
        $match: {
          restaurantId,
          createdAt: {
            $gte: startDate,
            $lt: endDate,
          },
        },
      },
      {
        $group: {
          _id: {
            $isoDayOfWeek: {
              date: '$createdAt',
              timezone: 'Asia/Ho_Chi_Minh',
            },
          },
          total: {
            $sum: 1,
          },
        },
      },
      {
        $sort: {
          _id: 1,
        },
      },
    ]);

    const bookingMap = new Map(result.map((item) => [item._id, item.total]));

    return Array.from({ length: 7 }, (_, index) => {
      const day = index + 1;

      return {
        day,
        label: day === 7 ? 'CN' : `T${day + 1}`,
        total: bookingMap.get(day) ?? 0,
      };
    });
  }

  private async getBookingStatusStats(
    restaurantId: Types.ObjectId,
    startDate: Date,
    endDate: Date,
  ) {
    const result = await this.bookingModel.aggregate([
      {
        $match: {
          restaurantId,
          createdAt: {
            $gte: startDate,
            $lt: endDate,
          },
        },
      },
      {
        $facet: {
          pending: [
            {
              $match: {
                status: BookingStatus.PENDING,
              },
            },
            {
              $count: 'total',
            },
          ],

          confirmed: [
            {
              $match: {
                status: BookingStatus.CONFIRMED,
              },
            },
            {
              $count: 'total',
            },
          ],

          checkedIn: [
            {
              $match: {
                status: BookingStatus.CHECKED_IN,
              },
            },
            {
              $count: 'total',
            },
          ],

          noShow: [
            {
              $match: {
                status: BookingStatus.NO_SHOW,
              },
            },
            {
              $count: 'total',
            },
          ],

          cancelled: [
            {
              $match: {
                status: BookingStatus.CANCELLED,
              },
            },
            {
              $count: 'total',
            },
          ],
        },
      },
    ]);

    const stats = result[0];

    return {
      pending: stats.pending[0]?.total ?? 0,
      confirmed: stats.confirmed[0]?.total ?? 0,
      checkedIn: stats.checkedIn[0]?.total ?? 0,
      noShow: stats.noShow[0]?.total ?? 0,
      cancelled: stats.cancelled[0]?.total ?? 0,
    };
  }

  private async getUpcomingBookings(userId: string) {
    const dto = new FindRestaurantBookingDto();

    dto.currentPage = 1;
    dto.pageSize = 5;

    const result =
      await this.bookingQueryService.findUpcomingRestaurantBookings(
        userId,
        dto,
      );

    return result.data;
  }
}
