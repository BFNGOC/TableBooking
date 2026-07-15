import { useQuery } from '@tanstack/react-query';
import { getRestaurantMeApi } from '../api/restaurant-api';
import { restaurantQueryKeys } from '../constants/query_key';

export const useRestaurantMe = () => {
    return useQuery({
        queryKey: restaurantQueryKeys.GET_RESTAURANT_ME,
        queryFn: getRestaurantMeApi,
        staleTime: 5 * 60 * 1000,
        retry: false,
    });
};
