import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTableDto } from './dto/create-table.dto';
import { UpdateTableDto } from './dto/update-table.dto';
import { AuthUser } from '@app/auth/types/auth-jwt-user.type';
import { InjectModel } from '@nestjs/mongoose/dist/common/mongoose.decorators';
import { Table, TableDocument } from './schemas/table.schema';
import { Area, AreaDocument } from '../areas/schemas/area.schema';
import { RestaurantsService } from '../restaurants/restaurants.service';
import { Model } from 'mongoose';
import { FindTablesDto } from './dto/find-table.dto';
import { UpdateTablePositionDto } from './dto/update-table-position.dto';
import { AreasService } from '../areas/areas.service';

@Injectable()
export class TablesService {
  constructor(
    @InjectModel(Table.name)
    private readonly tableModel: Model<TableDocument>,

    private readonly areasService: AreasService,

    private readonly restaurantsService: RestaurantsService,
  ) {}

  async create(dto: CreateTableDto, user: AuthUser) {
    const restaurant = await this.restaurantsService.getRestaurantByUserId(
      user._id,
    );

    await this.areasService.findByRestaurant(
      dto.areaId,
      restaurant._id.toString(),
    );

    await this.ensureUniqueTableNumber(
      restaurant._id.toString(),
      dto.tableNumber,
    );

    return this.tableModel.create({
      ...dto,
      restaurantId: restaurant._id,
    });
  }

  async findAll(dto: FindTablesDto) {
    return this.tableModel
      .find({
        areaId: dto.areaId,
      })
      .sort({
        tableNumber: 1,
      });
  }

  async findOne(tableId: string) {
    const table = await this.tableModel.findById(tableId);

    if (!table) {
      throw new NotFoundException('Table not found.');
    }

    return table;
  }

  async update(tableId: string, dto: UpdateTableDto, user: AuthUser) {
    const table = await this.findOwnedTable(tableId, user);

    if (dto.tableNumber && dto.tableNumber !== table.tableNumber) {
      await this.ensureUniqueTableNumber(
        table.restaurantId.toString(),
        dto.tableNumber,
        table._id.toString(),
      );
    }

    if (dto.areaId) {
      await this.areasService.findByRestaurant(
        dto.areaId,
        table.restaurantId.toString(),
      );
    }

    Object.assign(table, dto);

    return table.save();
  }

  async updatePosition(
    tableId: string,
    updateTablePositionDto: UpdateTablePositionDto,
    user: AuthUser,
  ) {
    const table = await this.findOwnedTable(tableId, user);

    table.x = updateTablePositionDto.x;
    table.y = updateTablePositionDto.y;

    return table.save();
  }

  async remove(tableId: string, user: AuthUser) {
    const table = await this.findOwnedTable(tableId, user);

    await table.deleteOne();

    return {
      message: 'Table deleted successfully.',
    };
  }

  private async findOwnedTable(
    tableId: string,
    user: AuthUser,
  ): Promise<TableDocument> {
    const restaurant = await this.restaurantsService.getRestaurantByUserId(
      user._id,
    );

    const table = await this.tableModel.findOne({
      _id: tableId,
      restaurantId: restaurant._id,
    });

    if (!table) {
      throw new NotFoundException('Table not found.');
    }

    return table;
  }

  private async ensureUniqueTableNumber(
    restaurantId: string,
    tableNumber: string,
    excludeId?: string,
  ) {
    const filter: any = {
      restaurantId,
      tableNumber: tableNumber.trim(),
    };

    if (excludeId) {
      filter._id = {
        $ne: excludeId,
      };
    }

    const existed = await this.tableModel.exists(filter);

    if (existed) {
      throw new ConflictException('Table number already exists.');
    }
  }
}
