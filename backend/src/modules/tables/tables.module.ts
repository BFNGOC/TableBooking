import { Module } from '@nestjs/common';
import { TablesService } from './tables.service';
import { TablesController } from './tables.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Table, TableSchema } from './schemas/table.schema';
import { RestaurantsModule } from '../restaurants/restaurants.module';
import { AreasModule } from '../areas/areas.module';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Table.name, schema: TableSchema }]),
    AreasModule,
    RestaurantsModule,
  ],
  controllers: [TablesController],
  providers: [TablesService],
  exports: [TablesService, MongooseModule],
})
export class TablesModule {}
