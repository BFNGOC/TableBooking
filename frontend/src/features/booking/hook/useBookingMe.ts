import { useQuery } from '@tanstack/react-query';
import { bookingRoleCustomerApi } from '../api/booking-api';
import { bookingQueryKeys } from '../constants/query-key';

export const useGetBookingDetail = (bookingId: string) => {
    return useQuery({
        queryKey: bookingQueryKeys.GET_BOOKING_DETAIL(bookingId),
        queryFn: () => bookingRoleCustomerApi.getBookingDetail(bookingId),
        enabled: Boolean(bookingId),
    });
};
