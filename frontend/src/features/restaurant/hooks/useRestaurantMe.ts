import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { getRestaurantMeApi, restaurantRoleRestaurantApi } from '../api/restaurant-api';

import { restaurantQueryKeys } from '../constants/query_key';
import { UpdateRestaurantProfilePayload } from '../types/restaurant.dto';
import { useToast } from '@/shared/hooks/useToast';
import { useSession } from 'next-auth/react';

export const useRestaurantMe = () => {
    const { status } = useSession();

    return useQuery({
        queryKey: restaurantQueryKeys.GET_RESTAURANT_ME,
        queryFn: getRestaurantMeApi,
        enabled: status === 'authenticated',
        staleTime: 5 * 60 * 1000,
        retry: false,
    });
};

export function useUpdateRestaurantProfile() {
    const { showToast } = useToast();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: UpdateRestaurantProfilePayload) =>
            restaurantRoleRestaurantApi.updateMe(data),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: restaurantQueryKeys.GET_RESTAURANT_ME,
            });

            showToast('success', 'Cập nhật thành công', 'Thông tin nhà hàng đã được cập nhật.');
        },

        onError: (error: any) => {
            showToast(
                'error',
                'Cập nhật thất bại',
                error?.message ?? 'Không thể cập nhật thông tin nhà hàng. Vui lòng thử lại.'
            );
        },
    });
}
