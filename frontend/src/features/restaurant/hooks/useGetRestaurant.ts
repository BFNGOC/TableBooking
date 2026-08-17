import { useQuery } from '@tanstack/react-query';
import { getRestaurantBySlugApi } from '../api/restaurant-api';
import { restaurantQueryKeys } from '../constants/query_key';

export function useGetRestaurantBySlug(slug: string) {
    return useQuery({
        queryKey: restaurantQueryKeys.GET_RESTAURANT_SLUG(slug),
        queryFn: () => getRestaurantBySlugApi(slug),
        enabled: !!slug,
    });
}
