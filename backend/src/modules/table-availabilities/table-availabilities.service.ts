import { Injectable } from '@nestjs/common';
import { CreateTableAvailabilityDto } from './dto/create-table-availability.dto';
import { UpdateTableAvailabilityDto } from './dto/update-table-availability.dto';

@Injectable()
export class TableAvailabilitiesService {
  create(createTableAvailabilityDto: CreateTableAvailabilityDto) {
    return 'This action adds a new tableAvailability';
  }

  findAll() {
    return `This action returns all tableAvailabilities`;
  }

  findOne(id: number) {
    return `This action returns a #${id} tableAvailability`;
  }

  update(id: number, updateTableAvailabilityDto: UpdateTableAvailabilityDto) {
    return `This action updates a #${id} tableAvailability`;
  }

  remove(id: number) {
    return `This action removes a #${id} tableAvailability`;
  }
}
