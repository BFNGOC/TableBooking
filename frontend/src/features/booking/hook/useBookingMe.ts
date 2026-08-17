import { useQuery } from '@tanstack/react-query';
import { bookingRoleCustomerApi } from '../api/booking-api';
import { bookingQueryKeys } from '../constants/query-key';

export const useGetBookingDetail = (bookingId: string) => {
    return useQuery({
        queryKey: bookingQueryKeys.GET_BOOKING_DETAIL(bookingId),
        queryFn: () => bookingRoleCustomerApi.getBookingDetail(bookingId),
        enabled: Boolean(bookingId),
        refetchInterval: (query) => {
            const data = query.state.data?.data;
            const booking = data?.booking ?? data;
            const status = booking?.status;

            // Tự động refetch mỗi 8 giây khi đơn đang ở trạng thái PENDING hoặc CONFIRMED
            // Giúp màn hình Khách hàng tự động cập nhật lên CHECKED_IN ngay khi Nhà hàng quét QR/mã check-in
            if (status === 'PENDING' || status === 'CONFIRMED') {
                return 8000;
            }
            return false;
        },
        refetchOnWindowFocus: true,
    });
};

export const useGetBookingListMe = () => {
    return useQuery({
        queryKey: bookingQueryKeys.GET_BOOKING_LIST_ME,
        queryFn: () => bookingRoleCustomerApi.getBookingListMe(),
        refetchOnWindowFocus: true,
    });
};

export const useGetBookingUpcomingMe = () => {
    return useQuery({
        queryKey: bookingQueryKeys.GET_BOOKING_UPCOMING_ME,
        queryFn: () => bookingRoleCustomerApi.getBookingUpcomingMe(),
        refetchInterval: 12000,
        refetchOnWindowFocus: true,
    });
};

export const useGetBookingRecentMe = () => {
    return useQuery({
        queryKey: bookingQueryKeys.GET_BOOKING_RECENT_ME,
        queryFn: () => bookingRoleCustomerApi.getBookingRecentMe(),
        refetchOnWindowFocus: true,
    });
};
