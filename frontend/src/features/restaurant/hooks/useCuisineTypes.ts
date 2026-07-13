import { useQuery } from '@tanstack/react-query';
import { getCuisineTypes } from '../api/restaurant-api';
import { restaurantQueryKeys } from '../constants/query_key';

export function useCuisineTypes() {
    return useQuery({
        queryKey: restaurantQueryKeys.GET_CUISINE_TYPES,
        queryFn: getCuisineTypes,
    });
}
