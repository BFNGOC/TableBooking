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

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

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

  @Get('/list')
  findListById(@CurrentUser() user: AuthUser) {
    return this.bookingsService.findListById(user._id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.bookingsService.findOne(id, user._id);
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
