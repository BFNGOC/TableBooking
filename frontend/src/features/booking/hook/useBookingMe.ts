import { useQuery } from '@tanstack/react-query';
import { getBookingMe } from '../api/booking-api';
import { bookingQueryKeys } from '../constants/query-key';

export const useGetBooking = (bookingId: string) => {
    return useQuery({
        queryKey: bookingQueryKeys.GET_BOOKING_ME(bookingId),
        queryFn: () => getBookingMe(bookingId),
        enabled: Boolean(bookingId),
    });
};
