import { sendRequest } from '@/shared/utils/api';
import { IUser } from '../types/user-type';
import { UserFilterParams } from '../types/user-filter-params-type';
import { UserFindAllPaginationType } from '../types/user-find-all-pagination-type';

const API_URL_PREFIX = '/users';

export const userRoleUserApi = {
    getMe: async () => {
        const res = await sendRequest<IUser>({ url: `${API_URL_PREFIX}/me`, method: 'GET' });

        return res.data;
    },

    update: async (payload: any) => {
        const res = await sendRequest<IUser>({
            url: `${API_URL_PREFIX}/me`,
            method: 'PUT',
            body: payload,
        });

        return res.data;
    },
};

export const userRoleAdminApi = {
    getAll: async (queryParams?: UserFilterParams) => {
        const res = await sendRequest<UserFindAllPaginationType>({
            url: `${API_URL_PREFIX}`,
            method: 'GET',
            queryParams,
        });

        return res.data;
    },
};
