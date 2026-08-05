import { useMutation, useQuery } from '@tanstack/react-query';
import { useToast } from '@/shared/hooks/useToast';
import { CreateBookingPayload, PreviewBookingPricingPayload } from '../types/booking.dto';
import { bookingRoleCustomerApi, bookingRoleRestaurantApi } from '../api/booking-api';
import { bookingQueryKeys } from '../constants/query-key';

export const useCreateBooking = () => {
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
    });
};
