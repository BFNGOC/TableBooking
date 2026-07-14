import { useMutation } from '@tanstack/react-query';
import { restaurantRoleCustomerApi } from '../api/restaurant-api';
import { useToast } from '@/shared/hooks/useToast';

export function useOnboarding() {
    const { showToast } = useToast();

    return useMutation({
        mutationFn: restaurantRoleCustomerApi.onboarding,

        onSuccess: () => {
            showToast('success', 'Đăng ký nhà hàng thành công', 'Yêu cầu của bạn đã được gửi.');
        },

        onError: (error: any) => {
            showToast('error', 'Đăng ký nhà hàng thất bại', error?.message ?? 'Có lỗi xảy ra');
        },
    });
}
