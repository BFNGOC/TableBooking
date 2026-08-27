import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AreasService } from './areas.service';
import { AreasController } from './areas.controller';
import { Area, AreaSchema } from './schemas/area.schema';
import {
  Restaurant,
  RestaurantSchema,
} from '../restaurants/schemas/restaurant.schema';
import { RestaurantsModule } from '../restaurants/restaurants.module';
import { TablesModule } from '../tables/tables.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Area.name, schema: AreaSchema },
      { name: Restaurant.name, schema: RestaurantSchema },
    ]),
    forwardRef(() => TablesModule),
    RestaurantsModule,
  ],
  controllers: [AreasController],
  providers: [AreasService],
  exports: [AreasService, MongooseModule],
})
export class AreasModule {}
