import {
  BookingDocument,
  BookingStatus,
  DepositStatus,
  PaymentStatus,
} from './schemas/booking.schema';
import { Types } from 'mongoose';

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
  const restaurantId = booking.restaurantId as
    | Types.ObjectId
    | { _id: Types.ObjectId };

  return {
    restaurantId:
      restaurantId instanceof Types.ObjectId
        ? restaurantId.toString()
        : restaurantId._id.toString(),

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
    createdAt: booking.get('createdAt'),
    updatedAt: booking.get('updatedAt'),
  };
}
