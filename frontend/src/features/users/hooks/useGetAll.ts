import { useQuery } from '@tanstack/react-query';
import { sanitizeQueryParams } from '@/shared/utils/api';
import { userRoleAdminApi } from '../api/user-api';
import { USER_QUERY_KEY } from '../contants/query-key';
import { UserFilterParams } from '../types/user-filter-params-type';

export const useGetAll = (queryParams: UserFilterParams) => {
    const sanitizedQueryParams = sanitizeQueryParams(queryParams, {
        currentPage: 1,
        pageSize: 1,
    });

    console.log(sanitizedQueryParams);

    return useQuery({
        queryKey: [
            USER_QUERY_KEY.GET_ALL,
            sanitizedQueryParams?.currentPage,
            sanitizedQueryParams?.pageSize,
            sanitizedQueryParams?.keySearch,
            sanitizedQueryParams?.isActive,
            sanitizedQueryParams?.role,
        ],
        queryFn: () => userRoleAdminApi.getAll(sanitizedQueryParams),
        staleTime: 30 * 1000,
        gcTime: 5 * 60 * 1000,
        placeholderData: (previousData) => previousData,
    });
};
