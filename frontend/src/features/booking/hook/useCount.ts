import { useQuery } from '@tanstack/react-query';
import { BookingStatusCount } from '../types/booking-response';
import { bookingRoleRestaurantApi } from '../api/booking-api';
import { bookingQueryKeys } from '../constants/query-key';

export const useBookingStatusCount = () => {
    return useQuery<BookingStatusCount>({
        queryKey: bookingQueryKeys.GET_STATUS_COUNT,
        queryFn: bookingRoleRestaurantApi.statusCount,
    });
};
