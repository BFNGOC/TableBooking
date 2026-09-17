import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { BookingsModule } from '../bookings/bookings.module';
import { PaymentModule } from '../payment/payment.module';
import { RestaurantsModule } from '../restaurants/restaurants.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Booking, BookingSchema } from '../bookings/schemas/booking.schema';
import { Payment, PaymentSchema } from '../payment/schemas/payment.schema';
import { User, UserSchema } from '../users/schemas/user.schema';
import { Table, TableSchema } from '../tables/schemas/table.schema';
import { StatisticsService } from './statistics.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Booking.name,
        schema: BookingSchema,
      },
      {
        name: Payment.name,
        schema: PaymentSchema,
      },
      {
        name: User.name,
        schema: UserSchema,
      },
      {
        name: Table.name,
        schema: TableSchema,
      },
    ]),
    BookingsModule,
    PaymentModule,
    RestaurantsModule,
  ],
  controllers: [DashboardController],
  providers: [DashboardService, StatisticsService],
})
export class DashboardModule {}
