import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateTableAvailabilityDto } from './dto/create-table-availability.dto';
import { UpdateTableAvailabilityDto } from './dto/update-table-availability.dto';
import {
  TableAvailability,
  TableAvailabilityDocument,
} from './schemas/table-availability.schema';

@Injectable()
export class TableAvailabilitiesService {
  constructor(
    @InjectModel(TableAvailability.name)
    private readonly tableAvailabilityModel: Model<TableAvailabilityDocument>,
  ) {}

  async getAvailableTimeSlots(restaurantId: string) {
    if (!Types.ObjectId.isValid(restaurantId)) {
      return [];
    }

    const availabilities = await this.tableAvailabilityModel
      .find({ restaurantId: new Types.ObjectId(restaurantId) })
      .lean();

    const timeSlots = new Set<string>();

    for (const availability of availabilities) {
      for (const weeklySlot of availability.weeklySlots ?? []) {
        if (!weeklySlot.isActive) continue;

        for (const slot of weeklySlot.slots ?? []) {
          timeSlots.add(slot.startTime);
        }
      }
    }

    return Array.from(timeSlots).sort().slice(0, 6);
  }

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
