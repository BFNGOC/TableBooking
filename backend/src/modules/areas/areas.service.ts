import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateAreaDto } from './dto/create-area.dto';
import { UpdateAreaDto } from './dto/update-area.dto';
import { FindAreasDto } from './dto/find-areas.dto';
import type { AuthUser } from '@app/auth/types/auth-jwt-user.type';
import { Area, AreaDocument } from './schemas/area.schema';
import { RestaurantsService } from '../restaurants/restaurants.service';

@Injectable()
export class AreasService {
  constructor(
    @InjectModel(Area.name)
    private readonly areaModel: Model<AreaDocument>,

    private readonly restaurantsService: RestaurantsService,
  ) {}

  async create(createAreaDto: CreateAreaDto, user: AuthUser) {
    const restaurant = await this.restaurantsService.getRestaurantByUserId(
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
    return this.areaModel
      .find({
        restaurantId: findAreasDto.restaurantId,
      })
      .sort({
        createdAt: 1,
      });
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

    // TODO:
    // const tableCount = await this.tableModel.countDocuments({
    //   areaId: area._id,
    // });
    //
    // if (tableCount > 0) {
    //   throw new BadRequestException(
    //     'Cannot delete area because it still contains tables.',
    //   );
    // }

    await area.deleteOne();

    return {
      message: 'Area deleted successfully.',
    };
  }

  private async findOwnedArea(
    areaId: string,
    user: AuthUser,
  ): Promise<AreaDocument> {
    const restaurant = await this.restaurantsService.getRestaurantByUserId(
      user._id,
    );

    const area = await this.areaModel.findOne({
      _id: areaId,
      restaurantId: restaurant._id,
    });

    if (!area) {
      throw new ForbiddenException(
        'You do not have permission to access this area.',
      );
    }

    return area;
  }
}
