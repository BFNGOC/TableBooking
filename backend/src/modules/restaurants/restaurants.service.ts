import { ConflictException, Injectable } from '@nestjs/common';
import { RestaurantOnboardingDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantProfileDto } from './dto/update-restaurant.dto';
import {
  Restaurant,
  RestaurantVerifyStatus,
} from './schemas/restaurant.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CUISINE_TYPES } from '@app/shared/dto/constants/cuisine-type.constant';
import { MailerService } from 'node_modules/@nestjs-modules/mailer/dist/mailer.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class RestaurantsService {
  constructor(
    @InjectModel(Restaurant.name)
    private restaurantModel: Model<Restaurant>,
    // private readonly mailerService: MailerService,
  ) {}

  getCuisineTypes() {
    return CUISINE_TYPES.map((item) => ({
      id: item,
      text: item,
    }));
  }

  async createOnboarding(
    userId: string,
    restaurantOnboardingDto: RestaurantOnboardingDto,
  ) {
    const isTaxCodeExists = await this.restaurantModel.findOne({
      taxCode: restaurantOnboardingDto.taxCode,
    });

    if (isTaxCodeExists) {
      throw new ConflictException(
        'Nhà hàng đã được đăng ký với mã số thuế này',
      );
    }

    const codeId = uuidv4();

    const restaurant = await this.restaurantModel.create({
      ...restaurantOnboardingDto,
      verifyStatus: RestaurantVerifyStatus.PENDING,
      userId,
    });

    return restaurantOnboardingDto;
  }

  findAll() {
    return `This action returns all restaurants`;
  }

  findOne(id: number) {
    return `This action returns a #${id} restaurant`;
  }

  update(id: number, UpdateRestaurantProfileDto: UpdateRestaurantProfileDto) {
    return `This action updates a #${id} restaurant`;
  }

  remove(id: number) {
    return `This action removes a #${id} restaurant`;
  }
}
