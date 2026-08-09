import { forwardRef, Module } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Booking, BookingSchema } from './schemas/booking.schema';
import { TablesModule } from '../tables/tables.module';
import { RestaurantsModule } from '../restaurants/restaurants.module';
import { TableAvailabilitiesModule } from '../table-availabilities/table-availabilities.module';
import { PricingRuleModule } from '../pricing-rule/pricing-rule.module';
import { RestaurantBookingSearchService } from './booking-restaurant-search.service';
import { SearchModule } from '../search/elasticsearch.module';
import { PaymentModule } from '../payment/payment.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Booking.name, schema: BookingSchema }]),
    TablesModule,
    TableAvailabilitiesModule,
    forwardRef(() => RestaurantsModule),
    PricingRuleModule,
    SearchModule,
    forwardRef(() => PaymentModule),
  ],
  controllers: [BookingsController],
  providers: [BookingsService, RestaurantBookingSearchService],
  exports: [BookingsService, MongooseModule, RestaurantBookingSearchService],
})
export class BookingsModule {}
