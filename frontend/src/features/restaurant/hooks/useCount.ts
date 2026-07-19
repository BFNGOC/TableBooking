import { useQuery } from '@tanstack/react-query';
import { restaurantRoleAdminApi } from '../api/restaurant-api';
import { restaurantQueryKeys } from '../constants/query_key';

export function useVerifyStatusCount() {
    return useQuery({
        queryKey: restaurantQueryKeys.GET_VERIFY_COUNT,
        queryFn: restaurantRoleAdminApi.verifyStatusCount,
    });
}
