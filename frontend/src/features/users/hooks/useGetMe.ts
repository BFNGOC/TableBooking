import { useQuery } from '@tanstack/react-query';
import { userRoleUserApi } from '../api/user-api';
import { useSession } from 'next-auth/react';
import { userQueryKeys } from '../contants/query-key';

export const useGetMe = () => {
    const { getMe } = userRoleUserApi;
    const { status } = useSession();

    return useQuery({
        queryKey: userQueryKeys.ME,
        queryFn: getMe,
        enabled: status === 'authenticated',
        retry: false,
        staleTime: 5 * 60 * 1000,
    });
};
