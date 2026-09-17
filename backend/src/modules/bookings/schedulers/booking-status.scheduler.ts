import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { BookingsService } from '../bookings.service';

@Injectable()
export class BookingStatusScheduler {
  private readonly logger = new Logger(BookingStatusScheduler.name);

  constructor(private readonly bookingsService: BookingsService) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async handleBookingStatus() {
    try {
      const expiredPending =
        await this.bookingsService.processExpiredPendingBookings();

      const noShow = await this.bookingsService.processNoShowBookings();

      if (expiredPending > 0 || noShow > 0) {
        this.logger.log(
          `Booking scheduler: ${expiredPending} expired, ${noShow} no-show`,
        );
      }
    } catch (error) {
      this.logger.error(
        'Failed to process booking statuses',
        error instanceof Error ? error.stack : error,
      );
    }
  }
}
