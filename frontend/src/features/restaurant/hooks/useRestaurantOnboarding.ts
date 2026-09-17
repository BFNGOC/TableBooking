import { useMutation, useQueryClient } from '@tanstack/react-query';
import { restaurantRoleCustomerApi } from '../api/restaurant-api';
import { useToast } from '@/shared/hooks/useToast';
import { restaurantQueryKeys } from '../constants/query_key';

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
export function useUpdateOnboarding() {
    const { showToast } = useToast();

    return useMutation({
        mutationFn: restaurantRoleCustomerApi.updateOnboarding,

        onSuccess: () => {
            showToast('success', 'Chỉnh sửa nhà hàng thành công', 'Yêu cầu của bạn đã được gửi.');
        },

        onError: (error: any) => {
            showToast('error', 'Chỉnh sửa nhà hàng thất bại', error?.message ?? 'Có lỗi xảy ra');
        },
    });
}

export function useVerifyEmailOnboarding() {
    const { showToast } = useToast();

    return useMutation({
        mutationFn: restaurantRoleCustomerApi.verifyEmail,

        onSuccess: () => {
            showToast(
                'success',
                'Xác thực email thành công',
                'Hãy chờ đợi admin xác thực tài khoản của bạn để tiếp tục sử dụng hệ thống.'
            );
        },

        onError: (error: any) => {
            showToast('error', 'Đăng ký nhà hàng thất bại', error?.message ?? 'Có lỗi xảy ra');
        },
    });
}

export function useResendVerifyEmailOnboarding() {
    const { showToast } = useToast();

    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: restaurantRoleCustomerApi.resendVerifyEmail,

        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: restaurantQueryKeys.GET_RESTAURANT_ME,
            });

            showToast(
                'success',
                'Gửi lại mã xác thực thành công',
                'Mã xác thực đã được gửi lại đến email của bạn.'
            );
        },

        onError: (error: any) => {
            showToast('error', 'Gửi lại mã xác thực thất bại', error?.message ?? 'Có lỗi xảy ra');
        },
    });
}
