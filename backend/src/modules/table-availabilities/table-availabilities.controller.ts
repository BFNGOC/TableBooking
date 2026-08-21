import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TableAvailabilitiesService } from './table-availabilities.service';
import { CreateTableAvailabilityDto } from './dto/create-table-availability.dto';
import { UpdateTableAvailabilityDto } from './dto/update-table-availability.dto';

@Controller('table-availabilities')
export class TableAvailabilitiesController {
  constructor(
    private readonly tableAvailabilitiesService: TableAvailabilitiesService,
  ) {}

  @Post()
  create(@Body() createTableAvailabilityDto: CreateTableAvailabilityDto) {
    return this.tableAvailabilitiesService.create(createTableAvailabilityDto);
  }

  @Get()
  findAll() {
    return this.tableAvailabilitiesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tableAvailabilitiesService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTableAvailabilityDto: UpdateTableAvailabilityDto,
  ) {
    return this.tableAvailabilitiesService.update(
      +id,
      updateTableAvailabilityDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tableAvailabilitiesService.remove(+id);
  }
}
