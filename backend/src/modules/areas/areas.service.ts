import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateAreaDto } from './dto/create-area.dto';
import { UpdateAreaDto } from './dto/update-area.dto';
import { Area, AreaDocument } from './schemas/area.schema';
import { RestaurantsService } from '../restaurants/restaurants.service';

@Injectable()
export class AreasService {
  constructor(
    @InjectModel(Area.name) private areaModel: Model<AreaDocument>,
    private readonly restaurantsService: RestaurantsService,
  ) {}

  async create(userId: string, createAreaDto: CreateAreaDto) {
    const userRestaurant =
      await this.restaurantsService.getCurrentUserRestaurant(userId);

    if (userRestaurant._id.toString() !== createAreaDto.restaurantId) {
      throw new BadRequestException(
        'Bạn không có quyền tạo area cho nhà hàng này',
      );
    }

    const area = await this.areaModel.create(createAreaDto);
    return area;
  }

  async findAll(restaurantId: string) {
    const areas = await this.areaModel.find({
      restaurantId: restaurantId,
    });

    return areas;
  }

  async findOne(restaurantId: string, id: string) {
    const area = await this.areaModel.findOne({
      _id: id,
      restaurantId: restaurantId,
    });

    if (!area) {
      throw new NotFoundException('Area không tìm thấy');
    }

    return area;
  }

  async update(userId: string, id: string, updateAreaDto: UpdateAreaDto) {
    const userRestaurant =
      await this.restaurantsService.getCurrentUserRestaurant(userId);

    const area = await this.areaModel.findOne({
      _id: id,
      restaurantId: userRestaurant._id,
    });

    if (!area) {
      throw new NotFoundException(
        'Area không tìm thấy hoặc bạn không có quyền sửa',
      );
    }

    if (
      updateAreaDto.restaurantId &&
      updateAreaDto.restaurantId !== userRestaurant._id.toString()
    ) {
      throw new BadRequestException('Bạn không thể thay đổi nhà hàng của area');
    }

    const updateData = { ...updateAreaDto };
    delete updateData.restaurantId;

    const updatedArea = await this.areaModel.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    return updatedArea;
  }

  async remove(userId: string, id: string) {
    const userRestaurant =
      await this.restaurantsService.getCurrentUserRestaurant(userId);

    // Find area
    const area = await this.areaModel.findOne({
      _id: id,
      restaurantId: userRestaurant._id,
    });

    if (!area) {
      throw new NotFoundException(
        'Area không tìm thấy hoặc bạn không có quyền xóa',
      );
    }

    await this.areaModel.findByIdAndDelete(id);

    return { message: 'Xóa area thành công' };
  }
}
