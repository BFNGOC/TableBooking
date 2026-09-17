import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateAreaDto } from './dto/create-area.dto';
import { UpdateAreaDto } from './dto/update-area.dto';
import { FindAreasDto } from './dto/find-areas.dto';
import type { AuthUser } from '@app/auth/types/auth-jwt-user.type';
import { Area, AreaDocument } from './schemas/area.schema';
import { RestaurantsService } from '../restaurants/restaurants.service';
import { TablesService } from '../tables/tables.service';

@Injectable()
export class AreasService {
  constructor(
    @InjectModel(Area.name)
    private readonly areaModel: Model<AreaDocument>,

    @Inject(forwardRef(() => RestaurantsService))
    private readonly restaurantsService: RestaurantsService,
    @Inject(forwardRef(() => TablesService))
    private readonly tablesService: TablesService,
  ) {}

  async create(createAreaDto: CreateAreaDto, user: AuthUser) {
    const restaurant = await this.restaurantsService.getCurrentUserRestaurant(
      user._id,
    );

    const existed = await this.areaModel.exists({
      restaurantId: restaurant._id,
      name: createAreaDto.name.trim(),
    });

    if (existed) {
      throw new BadRequestException('Area name already exists.');
    }

    return this.areaModel.create({
      ...createAreaDto,
      restaurantId: restaurant._id,
    });
  }

  async findAll(findAreasDto: FindAreasDto) {
    const areas = await this.areaModel
      .find({
        restaurantId: new Types.ObjectId(findAreasDto.restaurantId),
      })
      .sort({
        createdAt: 1,
      });
    return areas;
  }

  async findOne(areaId: string) {
    const area = await this.areaModel.findById(areaId);

    if (!area) {
      throw new NotFoundException('Area not found.');
    }

    return area;
  }

  async update(areaId: string, updateAreaDto: UpdateAreaDto, user: AuthUser) {
    const area = await this.findOwnedArea(areaId, user);

    if (updateAreaDto.name && updateAreaDto.name.trim() !== area.name) {
      const existed = await this.areaModel.exists({
        restaurantId: area.restaurantId,
        name: updateAreaDto.name.trim(),
        _id: {
          $ne: area._id,
        },
      });

      if (existed) {
        throw new BadRequestException('Area name already exists.');
      }
    }

    Object.assign(area, updateAreaDto);

    return area.save();
  }

  async remove(areaId: string, user: AuthUser) {
    const area = await this.findOwnedArea(areaId, user);
    const restaurant = await this.restaurantsService.getCurrentUserRestaurant(
      user._id,
    );

    const tableCount = await this.tablesService.countByArea(
      area._id.toString(),
      restaurant._id.toString(),
    );

    if (tableCount > 0) {
      throw new BadRequestException(
        'Cannot delete area because it still contains tables.',
      );
    }

    await area.deleteOne();

    return {
      message: 'Area deleted successfully.',
    };
  }

  private async findOwnedArea(
    areaId: string,
    user: AuthUser,
  ): Promise<AreaDocument> {
    const restaurant = await this.restaurantsService.getCurrentUserRestaurant(
      user._id,
    );

    const area = await this.areaModel.findOne({
      _id: new Types.ObjectId(areaId),
      restaurantId: restaurant._id,
    });

    if (!area) {
      throw new ForbiddenException(
        'You do not have permission to access this area.',
      );
    }

    return area;
  }

  async findByRestaurant(
    areaId: string,
    restaurantId: string,
  ): Promise<AreaDocument> {
    const area = await this.areaModel.findOne({
      _id: new Types.ObjectId(areaId),
      restaurantId: new Types.ObjectId(restaurantId),
    });

    if (!area) {
      throw new BadRequestException('Area not found.');
    }

    return area;
  }
}
