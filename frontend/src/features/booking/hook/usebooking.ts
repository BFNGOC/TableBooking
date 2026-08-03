import { useMutation } from '@tanstack/react-query';
import { useToast } from '@/shared/hooks/useToast';
import { CreateBookingPayload, PreviewBookingPricingPayload } from '../types/booking.dto';
import { createBookingApi, previewBookingPricingApi } from '../api/booking-api';

export const useCreateBooking = () => {
    const { showToast } = useToast();

    return useMutation({
        mutationFn: ({
            restaurantId,
            body,
        }: {
            restaurantId: string;
            body: CreateBookingPayload;
        }) => createBookingApi(restaurantId, body),

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
        }) => previewBookingPricingApi(restaurantId, body),
    });
};
