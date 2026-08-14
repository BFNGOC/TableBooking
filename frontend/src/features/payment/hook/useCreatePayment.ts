import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/shared/hooks/useToast';
import { CreatePaymentPayload } from '../types/payment.dto';
import { createPaymentApi } from '../api/payment-api';
import { bookingQueryKeys } from '@/features/booking/constants/query-key';

export const useCreatePayment = () => {
    const queryClient = useQueryClient();
    const { showToast } = useToast();

    return useMutation({
        mutationFn: ({
            restaurantId,
            body,
        }: {
            restaurantId: string;
            body: CreatePaymentPayload;
        }) => createPaymentApi(restaurantId, body),

        onSuccess: () => {
            showToast(
                'success',
                'Tạo thanh toán thành công',
                'Vui lòng thực hiện thanh toán để hoàn tất đặt bàn.'
            );

            queryClient.invalidateQueries({ queryKey: bookingQueryKeys.ROOT });
        },

        onError: (error: any) => {
            showToast(
                'error',
                'Tạo thanh toán thất bại',
                error?.message ?? 'Không thể tạo yêu cầu thanh toán. Vui lòng thử lại.'
            );
        },
    });
};
