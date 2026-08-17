import { forwardRef, Module } from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
import { RestaurantsController } from './restaurants.controller';
import { Restaurant, RestaurantSchema } from './schemas/restaurant.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { SearchModule } from '@app/modules/search/elasticsearch.module';
import { RestaurantSearchService } from './restaurant-admin-search.service';
import { RestaurantCustomerSearchService } from './restaurant-customer-search.service';
import { CounterModule } from '../counter/counter.module';
import { TaxModule } from '../tax/tax.module';
import { UsersModule } from '../users/users.module';
import { BookingsModule } from '../bookings/bookings.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Restaurant.name, schema: RestaurantSchema },
    ]),
    SearchModule,
    CounterModule,
    TaxModule,
    UsersModule,
    forwardRef(() => BookingsModule),
  ],
  controllers: [RestaurantsController],
  providers: [
    RestaurantsService,
    RestaurantSearchService,
    RestaurantCustomerSearchService,
  ],
  exports: [
    RestaurantsService,
    RestaurantSearchService,
    RestaurantCustomerSearchService,
  ],
})
export class RestaurantsModule {}
