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
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { CurrentUser } from '@app/decorator/current-user.decorator';
import type { AuthUser } from '@app/auth/types/auth-jwt-user.type';
import { Public } from '@app/decorator/customize';
import { GetAvailableTablesDto } from './dto/get-available-tables.dto';
import { FindRestaurantBookingDto } from './dto/find-restaurant.dto';
import { UserRole } from '../users/schemas/user.schema';
import { Roles } from '@app/decorator/roles.decorator';
import { CancelBookingDto } from './dto/cancel-booking.dto';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Get('restaurant/reindex')
  @Public()
  async reindex() {
    return this.bookingsService.reindexAll();
  }

  @Post(':restaurantId')
  createBooking(
    @Param('restaurantId') restaurantId: string,
    @CurrentUser() user: AuthUser,
    @Body() dto: CreateBookingDto,
  ) {
    return this.bookingsService.createBooking(restaurantId, user._id, dto);
  }

  @Get(':restaurantId/available-tables')
  getAvailableTables(
    @Param('restaurantId')
    restaurantId: string,

    @Query()
    dto: GetAvailableTablesDto,
  ) {
    return this.bookingsService.getAvailableTables(restaurantId, dto);
  }

  @Get('/me')
  findListById(@CurrentUser() user: AuthUser) {
    return this.bookingsService.findListById(user._id);
  }

  @Get('upcoming')
  findUpcomingBookingMe(@CurrentUser() user: AuthUser) {
    return this.bookingsService.findUpcomingBookingsMe(user._id);
  }

  @Get('recent')
  findRecentBookingsMeMe(@CurrentUser() user: AuthUser) {
    return this.bookingsService.findRecentBookingsMe(user._id);
  }

  @Get('/restaurant/all')
  @Roles(UserRole.ADMIN, UserRole.RESTAURANT)
  async findAllRestaurantBookings(
    @CurrentUser() user: AuthUser,
    @Query() query: FindRestaurantBookingDto,
  ) {
    return this.bookingsService.findAllRestaurantBookings(user._id, query);
  }

  @Get('/restaurant/upcoming')
  @Roles(UserRole.ADMIN, UserRole.RESTAURANT)
  async findUpcomingRestaurantBookings(
    @CurrentUser() user: AuthUser,
    @Query() query: FindRestaurantBookingDto,
  ) {
    return this.bookingsService.findUpcomingRestaurantBookings(user._id, query);
  }

  @Get('/status-count')
  @Roles(UserRole.ADMIN, UserRole.RESTAURANT)
  async bookingStatusCount(@CurrentUser() user: AuthUser) {
    return this.bookingsService.bookingStatusCount(user._id);
  }

  @Get('/restaurant/:id')
  @Roles(UserRole.ADMIN, UserRole.RESTAURANT)
  findBookingDetail(@Param('id') id: string) {
    return this.bookingsService.findBookingDetail(id);
  }

  @Patch(':bookingId/cancel')
  cancelBooking(
    @Param('bookingId') bookingId: string,
    @CurrentUser() user: AuthUser,
    @Body() dto: CancelBookingDto,
  ) {
    return this.bookingsService.cancelBooking(bookingId, user._id, dto);
  }

  @Get(':id')
  findOneBookingMe(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.bookingsService.findOneBookingMe(id, user._id);
  }

  @Get()
  findAll() {
    return this.bookingsService.findAll();
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBookingDto: UpdateBookingDto) {
    return this.bookingsService.update(+id, updateBookingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bookingsService.remove(+id);
  }
}
