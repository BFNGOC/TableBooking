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

export const useGetBookingListMe = () => {
    return useQuery({
        queryKey: bookingQueryKeys.GET_BOOKING_LIST_ME,
        queryFn: () => bookingRoleCustomerApi.getBookingListMe(),
    });
};

export const useGetBookingUpcomingMe = () => {
    return useQuery({
        queryKey: bookingQueryKeys.GET_BOOKING_UPCOMING_ME,
        queryFn: () => bookingRoleCustomerApi.getBookingUpcomingMe(),
    });
};

export const useGetBookingRecentMe = () => {
    return useQuery({
        queryKey: bookingQueryKeys.GET_BOOKING_RECENT_ME,
        queryFn: () => bookingRoleCustomerApi.getBookingRecentMe(),
    });
};
