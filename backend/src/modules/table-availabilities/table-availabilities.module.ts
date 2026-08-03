import { Module } from '@nestjs/common';
import { TableAvailabilitiesService } from './table-availabilities.service';
import { TableAvailabilitiesController } from './table-availabilities.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  TableAvailability,
  TableAvailabilitySchema,
} from './schemas/table-availability.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TableAvailability.name, schema: TableAvailabilitySchema },
    ]),
  ],
  controllers: [TableAvailabilitiesController],
  providers: [TableAvailabilitiesService],
  exports: [TableAvailabilitiesService, MongooseModule],
})
export class TableAvailabilitiesModule {}
