import { useQuery } from '@tanstack/react-query';
import { restaurantRoleAdminApi } from '../api/restaurant-api';
import { restaurantQueryKeys } from '../constants/query_key';

export function useRestaurantAdminDetail(id?: string) {
    return useQuery({
        queryKey: restaurantQueryKeys.GET_RESTAURANT_DETAIL(id!),

        queryFn: () => restaurantRoleAdminApi.getDetail(id!),

        enabled: !!id,
    });
}
