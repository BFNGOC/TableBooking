import { BookingStatus } from '@app/modules/bookings/schemas/booking.schema';

export interface BookingStatusAggregate {
  status: {
    _id: BookingStatus;
    count: number;
  }[];
  upcoming: {
    count: number;
  }[];
}
