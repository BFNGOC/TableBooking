import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { restaurantRoleAdminApi } from '../api/restaurant-api';
import { restaurantQueryKeys } from '../constants/query_key';
import { useToast } from '@/shared/hooks/useToast';

export function useRestaurantAdminDetail(id?: string) {
    return useQuery({
        queryKey: restaurantQueryKeys.GET_RESTAURANT_DETAIL(id!),

        queryFn: () => restaurantRoleAdminApi.getDetail(id!),

        enabled: !!id,
    });
}

export function useRestaurantAdminCheckTaxCode() {
    return useMutation({
        mutationFn: (id: string) => restaurantRoleAdminApi.checkTaxCode(id),
    });
}

export function useRestaurantAdminApprove() {
    const { showToast } = useToast();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => restaurantRoleAdminApi.approve(id),

        onSuccess: (_, id) => {
            showToast('success', 'Duyệt nhà hàng thành công', 'Nhà hàng đã được phê duyệt.');

            queryClient.invalidateQueries({ queryKey: restaurantQueryKeys.GET_RESTAURANT_LIST });
            queryClient.invalidateQueries({ queryKey: restaurantQueryKeys.GET_VERIFY_COUNT });

            queryClient.invalidateQueries({
                queryKey: restaurantQueryKeys.GET_RESTAURANT_DETAIL(id),
            });
        },

        onError: (error: any) => {
            showToast('error', 'Duyệt nhà hàng thất bại', error?.message ?? 'Có lỗi xảy ra');
        },
    });
}

export function useRestaurantAdminReject() {
    const { showToast } = useToast();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, reason }: { id: string; reason: string }) =>
            restaurantRoleAdminApi.reject(id, reason),

        onSuccess: (_, variables) => {
            showToast(
                'success',
                'Từ chối nhà hàng thành công',
                'Yêu cầu đăng ký nhà hàng đã được từ chối.'
            );

            queryClient.invalidateQueries({ queryKey: restaurantQueryKeys.GET_RESTAURANT_LIST });
            queryClient.invalidateQueries({ queryKey: restaurantQueryKeys.GET_VERIFY_COUNT });
            queryClient.invalidateQueries({
                queryKey: restaurantQueryKeys.GET_RESTAURANT_DETAIL(variables.id),
            });
        },

        onError: (error: any) => {
            showToast('error', 'Từ chối nhà hàng thất bại', error?.message ?? 'Có lỗi xảy ra');
        },
    });
}
