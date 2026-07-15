import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
import { RestaurantOnboardingDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantProfileDto } from './dto/update-restaurant.dto';
import { Public } from '@app/decorator/customize';
import { CurrentUser } from '@app/decorator/current-user.decorator';
import type { AuthUser } from '@app/auth/types/auth-jwt-user.type';
import { Roles } from '@app/decorator/roles.decorator';
import { UserRole } from '../users/schemas/user.schema';
import { CheckCodeDto } from '@app/auth/dto/check-code.dto';

@Controller('restaurants')
export class RestaurantsController {
  constructor(private readonly restaurantsService: RestaurantsService) {}

  @Get('/cuisine-types')
  @Public()
  getCuisineTypes() {
    return this.restaurantsService.getCuisineTypes();
  }

  @Get('/me')
  getCurrentUserRestaurant(@CurrentUser() user: AuthUser) {
    return this.restaurantsService.getCurrentUserRestaurant(user._id);
  }

  @Post('onboarding')
  @Roles(UserRole.CUSTOMER)
  createOnboarding(
    @CurrentUser() user: AuthUser,
    @Body() RestaurantOnboardingDto: RestaurantOnboardingDto,
  ) {
    return this.restaurantsService.createOnboarding(
      user._id,
      RestaurantOnboardingDto,
    );
  }

  @Post('resend-email')
  resendEmail(@CurrentUser() user: AuthUser) {
    return this.restaurantsService.resendEmail(user.email);
  }

  @Get()
  @Public()
  findAll(@Query('keyword') keyword?: string) {
    return this.restaurantsService.findAll(keyword);
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

  @Post('verify-email')
  @Roles(UserRole.CUSTOMER)
  verifyEmail(@Body() data: CheckCodeDto) {
    return this.restaurantsService.handleverifyEmail(data);
  }
}
