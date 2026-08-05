import {
  BookingDocument,
  BookingStatus,
  DepositStatus,
  PaymentStatus,
} from './schemas/booking.schema';

export const RESTAURANT_BOOKING_SEARCH_INDEX = 'restaurant_bookings';

export interface RestaurantBookingSearchDocument {
  restaurantId: string;

  userId: string;

  contactName?: string;

  contactPhone?: string;

  guestCount: number;

  status?: BookingStatus;

  bookingDate: Date;

  startTime: string;

  endTime: string;

  paymentStatus?: PaymentStatus;

  depositAmount: number;

  depositStatus?: DepositStatus;

  finalPrice?: number;

  createdAt?: Date;

  updatedAt?: Date;
}

export function toRestaurantBookingSearchDocument(
  booking: BookingDocument,
): RestaurantBookingSearchDocument {
  return {
    restaurantId: booking.restaurantId.toString(),

    userId: booking.userId.toString(),

    contactName: booking.contactName,

    contactPhone: booking.contactPhone,

    guestCount: booking.guestCount,

    status: booking.status,

    bookingDate: booking.bookingDate,

    startTime: booking.startTime,

    endTime: booking.endTime,

    paymentStatus: booking.paymentStatus,

    depositAmount: booking.depositAmount,

    depositStatus: booking.depositStatus,

    finalPrice: booking.pricingSnapshot?.finalPrice,

    createdAt: booking.createdAt,

    updatedAt: booking.updatedAt,
  };
}
