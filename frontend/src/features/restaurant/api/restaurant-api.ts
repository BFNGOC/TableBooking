import { clientRequest } from '@/shared/library/axios/client-api';

const API_URL_PREFIX = '/restaurants';

export const getCuisineTypes = async () => {
    const res = await clientRequest<any>({
        url: `${API_URL_PREFIX}/cuisine-types`,
        method: 'GET',
    });

    return res.data;
};
