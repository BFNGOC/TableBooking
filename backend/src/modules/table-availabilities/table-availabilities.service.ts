import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import type { AuthUser } from '@app/auth/types/auth-jwt-user.type';
import { RestaurantsService } from '../restaurants/restaurants.service';
import { TablesService } from '../tables/tables.service';
import {
  TableAvailability,
  TableAvailabilityDocument,
} from './schemas/table-availability.schema';
import { Table, TableDocument } from '../tables/schemas/table.schema';
import { CreateTableAvailabilityDto } from './dto/create-table-availability.dto';
import { FindTableAvailabilityDto } from './dto/find-table-availability.dto';
import { UpdateTableAvailabilityDto } from './dto/update-table-availability.dto';
import { UserRole } from '../users/schemas/user.schema';

@Injectable()
export class TableAvailabilitiesService {
  constructor(
    @InjectModel(TableAvailability.name)
    private readonly tableAvailabilityModel: Model<TableAvailabilityDocument>,
    @InjectModel(Table.name)
    private readonly tableModel: Model<TableDocument>,
    @Inject(forwardRef(() => RestaurantsService))
    private readonly restaurantsService: RestaurantsService,
    private readonly tablesService: TablesService,
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

  async create(dto: CreateTableAvailabilityDto, user: AuthUser) {
    const restaurant = await this.restaurantsService.getCurrentUserRestaurant(
      user._id,
    );

    await this.tablesService.assertTablesBelongToRestaurant(
      dto.tableIds,
      restaurant._id.toString(),
    );

    await this.assertTableIdsAreUniqueAcrossAvailabilities(
      dto.tableIds,
      restaurant._id.toString(),
    );

    this.validateTimeSlots(dto.weeklySlots, 'weeklySlots');
    this.validateTimeSlots(dto.exceptions ?? [], 'exceptions');

    const created = await this.tableAvailabilityModel.create({
      ...dto,
      restaurantId: new Types.ObjectId(restaurant._id.toString()),
      tableIds: dto.tableIds.map((id) => new Types.ObjectId(id)),
      weeklySlots: dto.weeklySlots.map((slot) => ({
        ...slot,
        slots: slot.slots.map((timeSlot) => ({
          ...timeSlot,
        })),
      })),
      exceptions: (dto.exceptions ?? []).map((item) => ({
        ...item,
        date: new Date(item.date),
        slots: item.slots ?? [],
      })),
    });

    return created;
  }

  async findMy(user: AuthUser) {
    const restaurant = await this.restaurantsService.getCurrentUserRestaurant(
      user._id,
    );
    return this.tableAvailabilityModel
      .find({ restaurantId: restaurant._id })
      .lean();
  }

  async findAvailable(dto: FindTableAvailabilityDto, user: AuthUser) {
    if (!dto.restaurantId) {
      throw new BadRequestException('restaurantId là bắt buộc');
    }

    const availability = await this.tableAvailabilityModel
      .findOne({
        restaurantId: new Types.ObjectId(dto.restaurantId),
      })
      .lean();

    if (!availability) {
      return {
        restaurantId: dto.restaurantId,
        date: dto.date ?? new Date().toISOString(),
        slots: [],
      };
    }

    const targetDate = dto.date ? new Date(dto.date) : new Date();
    const dayOfWeek = targetDate.getDay();
    const dateKey = targetDate.toISOString().split('T')[0];

    const exception = (availability.exceptions ?? []).find(
      (item: any) => item.date?.toISOString().split('T')[0] === dateKey,
    );

    if (exception) {
      return {
        restaurantId: dto.restaurantId,
        date: targetDate.toISOString(),
        slots: exception.isClosed ? [] : exception.slots,
      };
    }

    const weeklySlot = (availability.weeklySlots ?? []).find(
      (item: any) => item.dayOfWeek === dayOfWeek && item.isActive !== false,
    );

    return {
      restaurantId: dto.restaurantId,
      date: targetDate.toISOString(),
      slots: weeklySlot?.slots ?? [],
    };
  }

  async findOne(id: string, user: AuthUser) {
    const availability = await this.tableAvailabilityModel.findById(id).lean();

    if (!availability) {
      throw new NotFoundException('Không tìm thấy bảng availability');
    }

    if (user.role === UserRole.RESTAURANT) {
      const restaurant = await this.restaurantsService.getCurrentUserRestaurant(
        user._id,
      );
      if (availability.restaurantId?.toString() !== restaurant._id.toString()) {
        throw new NotFoundException('Không tìm thấy bảng availability');
      }
    }

    return availability;
  }

  async update(id: string, dto: UpdateTableAvailabilityDto, user: AuthUser) {
    const availability = await this.findOwnedAvailability(id, user);

    if (dto.tableIds !== undefined) {
      const restaurant = await this.restaurantsService.getCurrentUserRestaurant(
        user._id,
      );
      await this.tablesService.assertTablesBelongToRestaurant(
        dto.tableIds,
        restaurant._id.toString(),
      );

      await this.assertTableIdsAreUniqueAcrossAvailabilities(
        dto.tableIds,
        restaurant._id.toString(),
        id,
      );
    }

    const updatePayload: Partial<TableAvailability> = {};

    if (dto.tableIds !== undefined) {
      updatePayload.tableIds = dto.tableIds.map(
        (item) => new Types.ObjectId(item),
      );
    }

    if (dto.weeklySlots !== undefined) {
      this.validateTimeSlots(dto.weeklySlots, 'weeklySlots');
      updatePayload.weeklySlots = dto.weeklySlots.map((slot) => ({
        ...slot,
        isActive: slot.isActive ?? true,
        slots: slot.slots.map((timeSlot) => ({
          ...timeSlot,
        })),
      }));
    }

    if (dto.exceptions !== undefined) {
      this.validateTimeSlots(dto.exceptions, 'exceptions');
      updatePayload.exceptions = dto.exceptions.map((item) => ({
        ...item,
        date: new Date(item.date),
        slots: item.slots ?? [],
        isClosed: item.isClosed ?? false,
      }));
    }

    Object.assign(availability, updatePayload);

    return availability.save();
  }

  async remove(id: string, user: AuthUser) {
    const availability = await this.findOwnedAvailability(id, user);
    await availability.deleteOne();
    return {
      message: 'Table availability deleted successfully.',
    };
  }

  private async findOwnedAvailability(id: string, user: AuthUser) {
    const restaurant = await this.restaurantsService.getCurrentUserRestaurant(
      user._id,
    );

    const availability = await this.tableAvailabilityModel.findOne({
      _id: id,
      restaurantId: restaurant._id,
    });

    if (!availability) {
      throw new NotFoundException('Không tìm thấy bảng availability');
    }

    return availability;
  }

  private async assertTableIdsAreUniqueAcrossAvailabilities(
    tableIds: string[],
    restaurantId: string,
    currentAvailabilityId?: string,
  ) {
    const uniqueTableIds = [...new Set(tableIds.map((id) => id.toString()))];

    if (uniqueTableIds.length !== tableIds.length) {
      throw new BadRequestException(
        'Danh sách tableIds không được chứa trùng lặp cùng một bàn.',
      );
    }

    const query: any = {
      restaurantId: new Types.ObjectId(restaurantId),
      tableIds: { $in: uniqueTableIds.map((id) => new Types.ObjectId(id)) },
    };

    if (currentAvailabilityId) {
      query._id = { $ne: new Types.ObjectId(currentAvailabilityId) };
    }

    const existing = await this.tableAvailabilityModel.find(query).lean();

    if (existing.length > 0) {
      const duplicatedTables = new Set<string>();

      for (const availability of existing) {
        for (const tableId of availability.tableIds ?? []) {
          if (uniqueTableIds.includes(tableId.toString())) {
            duplicatedTables.add(tableId.toString());
          }
        }
      }

      if (duplicatedTables.size > 0) {
        const tableNumbers = await this.tableModel
          .find({
            _id: {
              $in: [...duplicatedTables].map((id) => new Types.ObjectId(id)),
            },
          })
          .select('tableNumber')
          .lean();

        const tableNumberText = tableNumbers
          .map((table) => table.tableNumber)
          .filter(Boolean)
          .join(', ');

        throw new BadRequestException(
          `Một số bàn đã thuộc lịch khả dụng khác: ${tableNumberText || [...duplicatedTables].join(', ')}`,
        );
      }
    }
  }

  private validateTimeSlots(
    slots: any[],
    fieldName: 'weeklySlots' | 'exceptions',
  ) {
    if (!slots?.length) {
      if (fieldName === 'weeklySlots') {
        throw new BadRequestException('weeklySlots không được rỗng');
      }
      return;
    }

    const seenDays = new Set<number>();

    for (const slot of slots) {
      if (fieldName === 'weeklySlots') {
        if (slot.dayOfWeek < 0 || slot.dayOfWeek > 6) {
          throw new BadRequestException('dayOfWeek phải nằm trong khoảng 0-6');
        }

        if (seenDays.has(slot.dayOfWeek)) {
          throw new BadRequestException(
            `dayOfWeek ${slot.dayOfWeek} bị trùng trong weeklySlots`,
          );
        }
        seenDays.add(slot.dayOfWeek);
      }

      if (fieldName === 'exceptions') {
        if (!slot.date) {
          throw new BadRequestException('exceptions phải có date');
        }
      }

      if (!slot.slots?.length) {
        throw new BadRequestException(
          `Mỗi ${fieldName} item phải có ít nhất 1 khung giờ`,
        );
      }

      const normalizedTimeSlots = slot.slots.map((timeSlot: any) => ({
        startTime: timeSlot.startTime?.trim(),
        endTime: timeSlot.endTime?.trim(),
      }));

      const parsedTimeSlots = normalizedTimeSlots.map((timeSlot: any) => {
        const start = this.parseTimeToMinutes(timeSlot.startTime);
        const end = this.parseTimeToMinutes(timeSlot.endTime);

        if (start >= end) {
          throw new BadRequestException(
            'Giờ bắt đầu phải nhỏ hơn giờ kết thúc',
          );
        }

        return {
          start,
          end,
        };
      });

      parsedTimeSlots.sort((a, b) => a.start - b.start);

      for (let index = 1; index < parsedTimeSlots.length; index += 1) {
        const previous = parsedTimeSlots[index - 1];
        const current = parsedTimeSlots[index];

        if (current.start < previous.end) {
          throw new BadRequestException(
            `Các TimeSlot trong cùng một ${fieldName} không được trồng lấn nhau`,
          );
        }
      }
    }
  }

  private parseTimeToMinutes(value: string): number {
    const match = /^(\d{1,2}):(\d{2})$/.exec(value?.trim() ?? '');

    if (!match) {
      throw new BadRequestException(`Định dạng giờ không hợp lệ: ${value}`);
    }

    const hours = Number.parseInt(match[1], 10);
    const minutes = Number.parseInt(match[2], 10);

    if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
      throw new BadRequestException(`Định dạng giờ không hợp lệ: ${value}`);
    }

    return hours * 60 + minutes;
  }
}
