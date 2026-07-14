import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
import { RestaurantOnboardingDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantProfileDto } from './dto/update-restaurant.dto';
import { Public } from '@app/decorator/customize';
import { CurrentUser } from '@app/decorator/current-user.decorator';
import type { AuthUser } from '@app/auth/types/auth-jwt-user.type';

@Controller('restaurants')
export class RestaurantsController {
  constructor(private readonly restaurantsService: RestaurantsService) {}

  @Get('/cuisine-types')
  @Public()
  getCuisineTypes() {
    return this.restaurantsService.getCuisineTypes();
  }

  @Post('onboarding')
  createOnboarding(
    @CurrentUser() user: AuthUser,
    @Body() RestaurantOnboardingDto: RestaurantOnboardingDto,
  ) {
    return this.restaurantsService.createOnboarding(
      user._id,
      RestaurantOnboardingDto,
    );
  }

  @Get()
  findAll() {
    return this.restaurantsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.restaurantsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateRestaurantDto: UpdateRestaurantProfileDto,
  ) {
    return this.restaurantsService.update(+id, updateRestaurantDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.restaurantsService.remove(+id);
  }
}
