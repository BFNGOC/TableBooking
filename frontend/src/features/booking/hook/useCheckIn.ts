import { useMutation, useQueryClient } from '@tanstack/react-query';
import { bookingRoleRestaurantApi } from '../api/booking-api';
import { bookingQueryKeys } from '../constants/query-key';
import { useToast } from '@/shared/hooks/useToast';

export const useVerifyCheckIn = () => {
    const { showToast } = useToast();

    return useMutation({
        mutationFn: (data: { checkInToken?: string; checkInCode?: string }) =>
            bookingRoleRestaurantApi.verifyCheckIn(data),

        onError: (error: any) => {
            showToast(
                'error',
                'Xác nhận check-in thất bại',
                error?.message || 'Đã xảy ra lỗi khi xác nhận check-in. Vui lòng thử lại.'
            );
        },
    });
};

export const useCheckInBooking = () => {
    const queryClient = useQueryClient();
    const { showToast } = useToast();

    return useMutation({
        mutationFn: (bookingId: string) => bookingRoleRestaurantApi.checkIn(bookingId),

        onSuccess: () => {
            showToast(
                'success',
                'Xác nhận check-in thành công',
                'Xác nhận check-in đã được thực hiện thành công.'
            );

            queryClient.invalidateQueries({ queryKey: bookingQueryKeys.ROOT });
            queryClient.invalidateQueries({ queryKey: ['available-tables'] });
        },

        onError: (error: any) => {
            showToast(
                'error',
                'Xác nhận check-in thất bại',
                error?.message || 'Đã xảy ra lỗi khi xác nhận check-in. Vui lòng thử lại.'
            );
        },
    });
};
