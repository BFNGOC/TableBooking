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
import { FindRestaurantAdminDto } from './dto/find-restaurant.dto';
import { FindPublicRestaurantDto } from './dto/find-public-restaurant.dto';
import { UpdateRestaurantOnboardingDto } from './dto/update-restaurant-onboarding.dto';
import { GetAvailableTablesDto } from '../bookings/dto/get-available-tables.dto';

@Controller('restaurants')
export class RestaurantsController {
  constructor(private readonly restaurantsService: RestaurantsService) {}

  @Get('admin/reindex')
  @Public()
  async reindex() {
    return this.restaurantsService.reindexAll();
  }

  @Get('/cuisine-types')
  @Public()
  getCuisineTypes() {
    return this.restaurantsService.getCuisineTypes();
  }

  @Get('/recommended')
  @Public()
  getPublicRecommendRestaurants() {
    return this.restaurantsService.getRecommendRestaurants();
  }

  @Get('/:slug/available-time-slots')
  @Public()
  getAvailableTimeSlots(@Param('slug') slug: string) {
    return this.restaurantsService.getAvailableTimeSlotsBySlug(slug);
  }

  @Get('/')
  @Public()
  getPublicRestaurants(@Query() query: FindPublicRestaurantDto) {
    return this.restaurantsService.getRestaurants(query);
  }

  @Get('/:slug')
  @Public()
  getPublicRestaurantBySlug(@Param('slug') slug: string) {
    return this.restaurantsService.getRestaurantBySlug(slug);
  }

  @Get('/me')
  getCurrentUserRestaurant(@CurrentUser() user: AuthUser) {
    return this.restaurantsService.getCurrentUserRestaurant(user._id);
  }

  @Patch('me/')
  async updateRestaurantMe(
    @CurrentUser() user: AuthUser,
    @Body() dto: UpdateRestaurantProfileDto,
  ) {
    return this.restaurantsService.updateRestaurantMe(user._id, dto);
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

  @Get('admin')
  @Roles(UserRole.ADMIN)
  findAll(@Query() query: FindRestaurantAdminDto) {
    return this.restaurantsService.findAll(query);
  }

  @Get('admin/verify-status-count')
  @Roles(UserRole.ADMIN)
  getVerifyStatusCount() {
    return this.restaurantsService.getVerifyStatusCount();
  }

  @Get('admin/:id')
  @Roles(UserRole.ADMIN)
  async getAdminDetail(@Param('id') id: string) {
    return this.restaurantsService.getAdminDetail(id);
  }

  @Post('admin/:id/verify-tax-code')
  @Roles(UserRole.ADMIN)
  async verifyTaxCode(@Param('id') restaurantId: string) {
    return this.restaurantsService.verifyTaxCode(restaurantId);
  }

  @Patch('admin/:id/approve')
  @Roles(UserRole.ADMIN)
  async approveRestaurant(@Param('id') id: string) {
    return this.restaurantsService.approveRestaurant(id);
  }

  @Patch('admin/:id/reject')
  @Roles(UserRole.ADMIN)
  async rejectRestaurant(
    @Param('id') id: string,
    @Body() body: { reason: string },
  ) {
    return this.restaurantsService.rejectRestaurant(id, body.reason);
  }

  @Patch('onboarding/me')
  @Roles(UserRole.ADMIN, UserRole.CUSTOMER)
  async updateOnboarding(
    @CurrentUser() user: AuthUser,
    @Body() dto: UpdateRestaurantOnboardingDto,
  ) {
    return this.restaurantsService.updateOnboarding(user._id, dto);
  }

  //booking

  //to-do
  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.restaurantsService.findOne(+id);
  // }

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
