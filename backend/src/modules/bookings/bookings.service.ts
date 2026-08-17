import { Injectable } from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { GetAvailableTablesDto } from './dto/get-available-tables.dto';
import { FindRestaurantBookingDto } from './dto/find-restaurant.dto';
import { CancelBookingDto } from './dto/cancel-booking.dto';
import { CheckInBookingDto } from './dto/check-in.dto';
import { BookingStateService } from './services/booking-state.service';
import { BookingQueryService } from './services/booking-query.service';

@Injectable()
export class BookingsService {
  constructor(
    private readonly bookingStateService: BookingStateService,
    private readonly bookingQueryService: BookingQueryService,
  ) {}

  reindexAll() {
    return this.bookingQueryService.reindexAll();
  }

  createBooking(restaurantId: string, userId: string, dto: CreateBookingDto) {
    return this.bookingStateService.createBooking(restaurantId, userId, dto);
  }

  getAvailableTables(restaurantId: string, dto: GetAvailableTablesDto) {
    return this.bookingQueryService.getAvailableTables(restaurantId, dto);
  }

  findListById(userId: string) {
    return this.bookingQueryService.findListById(userId);
  }

  findUpcomingBookingsMe(userId: string) {
    return this.bookingQueryService.findUpcomingBookingsMe(userId);
  }

  findRecentBookingsMe(userId: string) {
    return this.bookingQueryService.findRecentBookingsMe(userId);
  }

  findAllRestaurantBookings(userId: string, query: FindRestaurantBookingDto) {
    return this.bookingQueryService.findAllRestaurantBookings(userId, query);
  }

  findUpcomingRestaurantBookings(
    userId: string,
    query: FindRestaurantBookingDto,
  ) {
    return this.bookingQueryService.findUpcomingRestaurantBookings(
      userId,
      query,
    );
  }

  bookingStatusCount(userId: string) {
    return this.bookingQueryService.bookingStatusCount(userId);
  }

  findBookingDetail(id: string) {
    return this.bookingQueryService.findBookingDetail(id);
  }

  findOneBookingMe(id: string, userId: string) {
    return this.bookingQueryService.findOneBookingMe(id, userId);
  }

  cancelBooking(bookingId: string, userId: string, dto: CancelBookingDto) {
    return this.bookingStateService.cancelBooking(bookingId, userId, dto);
  }

  rejectBooking(bookingId: string, userId: string, reason: string) {
    return this.bookingStateService.rejectBooking(bookingId, userId, reason);
  }

  verifyCheckInBooking(dto: CheckInBookingDto, userId: string) {
    return this.bookingQueryService.verifyCheckInBooking(dto, userId);
  }

  checkInBooking(bookingId: string, userId: string) {
    return this.bookingStateService.checkInBooking(bookingId, userId);
  }

  processExpiredPendingBookings(): Promise<number> {
    return this.bookingStateService.processExpiredPendingBookings();
  }

  processNoShowBookings(): Promise<number> {
    return this.bookingStateService.processNoShowBookings();
  }

  findAll() {
    return `This action returns all bookings`;
  }

  update(id: number, updateBookingDto: UpdateBookingDto) {
    return `This action updates a #${id} booking`;
  }

  remove(id: number) {
    return `This action removes a #${id} booking`;
  }
}
