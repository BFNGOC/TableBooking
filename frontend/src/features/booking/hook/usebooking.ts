import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/shared/hooks/useToast';
import { CreateBookingPayload, PreviewBookingPricingPayload } from '../types/booking.dto';
import { bookingRoleCustomerApi, bookingRoleRestaurantApi } from '../api/booking-api';
import { bookingQueryKeys } from '../constants/query-key';

export const useCreateBooking = () => {
    const queryClient = useQueryClient();
    const { showToast } = useToast();

    return useMutation({
        mutationFn: ({
            restaurantId,
            body,
        }: {
            restaurantId: string;
            body: CreateBookingPayload;
        }) => bookingRoleCustomerApi.createBooking(restaurantId, body),

        onSuccess: () => {
            showToast(
                'success',
                'Đặt bàn thành công',
                'Yêu cầu đặt bàn của bạn đã được gửi thành công.'
            );

            queryClient.invalidateQueries({ queryKey: bookingQueryKeys.ROOT });
            queryClient.invalidateQueries({ queryKey: ['available-tables'] });
        },

        onError: (error: any) => {
            showToast(
                'error',
                'Đặt bàn thất bại',
                error?.message || 'Đã xảy ra lỗi khi đặt bàn. Vui lòng thử lại.'
            );
        },
    });
};

export const usePreviewBookingPricing = () => {
    return useMutation({
        mutationFn: ({
            restaurantId,
            body,
        }: {
            restaurantId: string;
            body: PreviewBookingPricingPayload;
        }) => bookingRoleCustomerApi.previewBookingPricing(restaurantId, body),
    });
};

export const useBookingDetail = (bookingId?: string) => {
    return useQuery({
        queryKey: bookingQueryKeys.GET_DETAIL_RESTAURANT(bookingId ?? ''),
        queryFn: async () => {
            if (!bookingId) {
                throw new Error('Booking id is required');
            }

            return bookingRoleRestaurantApi.get_detail(bookingId);
        },
        enabled: Boolean(bookingId),
        refetchInterval: (query) => {
            const booking = query.state.data?.data;
            const status = booking?.status;
            if (status === 'PENDING' || status === 'CONFIRMED') {
                return 8000;
            }
            return false;
        },
        refetchOnWindowFocus: true,
    });
};

export const useCancelBooking = () => {
    const queryClient = useQueryClient();
    const { showToast } = useToast();

    return useMutation({
        mutationFn: ({ bookingId, reason }: { bookingId: string; reason: string }) =>
            bookingRoleCustomerApi.cancelBooking(bookingId, reason),

        onSuccess: () => {
            showToast(
                'success',
                'Hủy đặt bàn thành công',
                'Yêu cầu hủy đặt bàn của bạn đã được gửi thành công.'
            );

            queryClient.invalidateQueries({ queryKey: bookingQueryKeys.ROOT });
            queryClient.invalidateQueries({ queryKey: ['available-tables'] });
        },
        onError: (error: any) => {
            showToast(
                'error',
                'Hủy đặt bàn thất bại',
                error?.message || 'Đã xảy ra lỗi khi hủy đặt bàn. Vui lòng thử lại.'
            );
        },
    });
};

export const useRejectBooking = () => {
    const queryClient = useQueryClient();
    const { showToast } = useToast();

    return useMutation({
        mutationFn: ({ bookingId, reason }: { bookingId: string; reason: string }) =>
            bookingRoleRestaurantApi.rejectBooking(bookingId, reason),

        onSuccess: () => {
            showToast(
                'success',
                'Từ chối đặt bàn thành công',
                'Yêu cầu từ chối đặt bàn của bạn đã được gửi thành công.'
            );

            queryClient.invalidateQueries({ queryKey: bookingQueryKeys.ROOT });
            queryClient.invalidateQueries({ queryKey: ['available-tables'] });
        },
        onError: (error: any) => {
            showToast(
                'error',
                'Từ chối đặt bàn thất bại',
                error?.message || 'Đã xảy ra lỗi khi từ chối đặt bàn. Vui lòng thử lại.'
            );
        },
    });
};
