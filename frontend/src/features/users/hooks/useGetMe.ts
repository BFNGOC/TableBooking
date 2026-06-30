import { useQuery } from '@tanstack/react-query';
import { userRoleUserApi } from '../api/user-api';

export const useGetMe = () => {
    const { getMe } = userRoleUserApi;

    return useQuery({
        queryKey: ['me'],
        queryFn: getMe,
        retry: false,
    });
};
