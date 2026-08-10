import { Module } from '@nestjs/common';
import { TableAvailabilitiesService } from './table-availabilities.service';
import { TableAvailabilitiesController } from './table-availabilities.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  TableAvailability,
  TableAvailabilitySchema,
} from './schemas/table-availability.schema';
import { RestaurantsModule } from '../restaurants/restaurants.module';
import { TablesModule } from '../tables/tables.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TableAvailability.name, schema: TableAvailabilitySchema },
    ]),
    RestaurantsModule,
    TablesModule,
  ],
  controllers: [TableAvailabilitiesController],
  providers: [TableAvailabilitiesService],
  exports: [TableAvailabilitiesService, MongooseModule],
})
export class TableAvailabilitiesModule {}
