import { Module } from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
import { RestaurantsController } from './restaurants.controller';
import { Restaurant, RestaurantSchema } from './schemas/restaurant.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { SearchModule } from '@app/modules/search/elasticsearch.module';
import { RestaurantSearchService } from './restaurant-admin-search.service';
import { CounterModule } from '../counter/counter.module';
import { TaxModule } from '../tax/tax.module';
import { UsersModule } from '../users/users.module';
import { TablesModule } from '../tables/tables.module';
import { BookingsModule } from '../bookings/bookings.module';
import { TableAvailabilitiesModule } from '../table-availabilities/table-availabilities.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Restaurant.name, schema: RestaurantSchema },
    ]),
    SearchModule,
    CounterModule,
    TaxModule,
    UsersModule,
    TablesModule,
    TableAvailabilitiesModule,
    BookingsModule,
  ],
  controllers: [RestaurantsController],
  providers: [RestaurantsService, RestaurantSearchService],
  exports: [RestaurantsService, RestaurantSearchService],
})
export class RestaurantsModule {}
