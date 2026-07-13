import { Injectable } from '@nestjs/common';
import { RestaurantOnboardingDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantProfileDto } from './dto/update-restaurant.dto';
import { Restaurant } from './schemas/restaurant.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CUISINE_TYPES } from '@app/shared/dto/constants/cuisine-type.constant';

@Injectable()
export class RestaurantsService {
  constructor(
    @InjectModel(Restaurant.name)
    private restaurantModel: Model<Restaurant>,
  ) {}

  getCuisineTypes() {
    return CUISINE_TYPES.map((item) => ({
      id: item,
      text: item,
    }));
  }

  create(RestaurantOnboardingDto: RestaurantOnboardingDto) {
    return 'This action adds a new restaurant';
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
