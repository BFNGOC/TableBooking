import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { CreateTableDto } from './dto/create-table.dto';
import { UpdateTableDto } from './dto/update-table.dto';
import { AuthUser } from '@app/auth/types/auth-jwt-user.type';
import { InjectModel } from '@nestjs/mongoose/dist/common/mongoose.decorators';
import { Table, TableDocument } from './schemas/table.schema';
import { Area, AreaDocument } from '../areas/schemas/area.schema';
import { RestaurantsService } from '../restaurants/restaurants.service';
import { Model, Types } from 'mongoose';
import { FindTablesDto } from './dto/find-table.dto';
import { UpdateTablePositionDto } from './dto/update-table-position.dto';
import { BulkUpdatePositionsDto } from './dto/bulk-update-positions.dto';
import { AreasService } from '../areas/areas.service';

@Injectable()
export class TablesService {
  constructor(
    @InjectModel(Table.name)
    private readonly tableModel: Model<TableDocument>,

    @Inject(forwardRef(() => AreasService))
    private readonly areasService: AreasService,

    @Inject(forwardRef(() => RestaurantsService))
    private readonly restaurantsService: RestaurantsService,
  ) {}

  async create(dto: CreateTableDto, user: AuthUser) {
    const restaurant = await this.restaurantsService.getCurrentUserRestaurant(
      user._id,
    );
    await this.areasService.findByRestaurant(
      dto.areaId,
      restaurant._id.toString(),
    );

    let tableNumber: string;
    if (dto.tableNumber) {
      // Người dùng nhập thủ công → kiểm tra unique
      await this.ensureUniqueTableNumber(
        restaurant._id.toString(),
        dto.tableNumber,
      );
      tableNumber = dto.tableNumber.trim();
    } else {
      // Tự sinh
      tableNumber = await this.generateAutoTableNumber(
        restaurant._id.toString(),
        dto.areaId,
      );
    }

    const table = await this.tableModel.create({
      ...dto,
      restaurantId: restaurant._id,
      areaId: new Types.ObjectId(dto.areaId),
      tableNumber,
    });
    return table;
  }

  async findAll(dto: FindTablesDto) {
    const tables = await this.tableModel
      .find({
        areaId: new Types.ObjectId(dto.areaId),
      })
      .sort({
        tableNumber: 1,
      });
    console.log('tables', tables);
    return tables;
  }

  async findOne(tableId: string) {
    const table = await this.tableModel.findById(tableId);

    if (!table) {
      throw new NotFoundException(
        'Không tìm thấy bàn hoặc bàn không thuộc nhà hàng của bạn',
      );
    }

    return table;
  }

  async update(tableId: string, dto: UpdateTableDto, user: AuthUser) {
    const table = await this.findOwnedTable(tableId, user);

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

  async bulkUpdatePositions(dto: BulkUpdatePositionsDto, user: AuthUser) {
    if (!dto.positions?.length) return { updated: 0 };

    const restaurant = await this.restaurantsService.getCurrentUserRestaurant(
      user._id,
    );

    const tableIds = dto.positions.map((p) => p.tableId);

    // Verify tất cả bàn thuộc nhà hàng này
    const count = await this.tableModel.countDocuments({
      _id: { $in: tableIds.map((id) => new Types.ObjectId(id)) },
      restaurantId: restaurant._id,
    });

    if (count !== tableIds.length) {
      throw new NotFoundException(
        'Một hoặc nhiều bàn không thuộc nhà hàng của bạn',
      );
    }

    // Batch update 1 lần duy nhất
    await this.tableModel.bulkWrite(
      dto.positions.map(({ tableId, x, y }) => ({
        updateOne: {
          filter: { _id: new Types.ObjectId(tableId) },
          update: { $set: { x, y } },
        },
      })),
    );

    return { updated: dto.positions.length };
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
    const restaurant = await this.restaurantsService.getCurrentUserRestaurant(
      user._id,
    );

    const table = await this.tableModel.findOne({
      _id: tableId,
      restaurantId: restaurant._id,
    });

    if (!table) {
      throw new NotFoundException(
        'Không tìm thấy bàn hoặc bàn không thuộc nhà hàng của bạn',
      );
    }

    return table;
  }

  async assertTablesBelongToRestaurant(
    tableIds: string[],
    restaurantId: string,
  ): Promise<void> {
    if (!tableIds?.length) {
      throw new BadRequestException('tableIds không được rỗng');
    }

    const count = await this.tableModel.countDocuments({
      _id: { $in: tableIds.map((id) => new Types.ObjectId(id)) },
      restaurantId: new Types.ObjectId(restaurantId),
    });

    if (count !== tableIds.length) {
      throw new BadRequestException(
        'Một hoặc nhiều bàn không thuộc nhà hàng của bạn',
      );
    }
  }

  private async ensureUniqueTableNumber(
    restaurantId: string,
    tableNumber: string,
    excludeId?: string,
  ) {
    const filter: any = {
      restaurantId: new Types.ObjectId(restaurantId),
      tableNumber: tableNumber.trim(),
    };

    if (excludeId) {
      filter._id = {
        $ne: new Types.ObjectId(excludeId),
      };
    }

    const existed = await this.tableModel.exists(filter);

    if (existed) {
      throw new ConflictException(
        'Số hiệu bàn đã tồn tại trong nhà hàng của bạn',
      );
    }
  }

  private async generateAutoTableNumber(
    restaurantId: string,
    areaId: string,
  ): Promise<string> {
    const existingNumbers = await this.tableModel
      .find({
        restaurantId: new Types.ObjectId(restaurantId),
        areaId: new Types.ObjectId(areaId),
      })
      .select('tableNumber')
      .lean();

    const usedNumbers = new Set(
      existingNumbers.map((table) => table.tableNumber),
    );
    let nextIndex = existingNumbers.length + 1;
    let candidate = '';

    do {
      candidate = `T${nextIndex.toString().padStart(3, '0')}`;
      nextIndex += 1;
    } while (usedNumbers.has(candidate));

    return candidate;
  }

  async countByArea(areaId: string, restaurantId: string): Promise<number> {
    return this.tableModel.countDocuments({
      areaId: new Types.ObjectId(areaId),
      restaurantId: new Types.ObjectId(restaurantId),
    });
  }
}
