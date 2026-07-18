import { Module } from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
import { RestaurantsController } from './restaurants.controller';
import { Restaurant, RestaurantSchema } from './schemas/restaurant.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { SearchModule } from '@app/modules/search/elasticsearch.module';
import { RestaurantSearchService } from './restaurant-admin-search.service';
import { CounterModule } from '../counter/counter.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Restaurant.name, schema: RestaurantSchema },
    ]),
    SearchModule,
    CounterModule,
  ],
  controllers: [RestaurantsController],
  providers: [RestaurantsService, RestaurantSearchService],
  exports: [RestaurantsService, RestaurantSearchService],
})
export class RestaurantsModule {}
