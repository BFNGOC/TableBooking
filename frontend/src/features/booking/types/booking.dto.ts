import { IBooking } from './booking.type';
import { CalendarDate, Time } from '@internationalized/date';

export type CreateBookingPayload = Pick<
    IBooking,
    | 'bookingDate'
    | 'startTime'
    | 'guestCount'
    | 'tableIds'
    | 'restaurantNote'
    | 'contactName'
    | 'contactPhone'
> & {
    payDepositNow?: boolean;
};

export interface GetAvailableTablesPayload {
    date: CalendarDate | string;
    startTime: Time | string;
    guestCount: number;
}

export interface PreviewBookingPricingPayload {
    tableIds: string[];
    bookingDate: string | Date;
    startTime: string;
}
