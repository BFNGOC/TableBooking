import { clientRequest } from '@/shared/library/axios/client-api';
import { RestaurantOnboardingPayload } from '../types/restaurant.dto';

const API_URL_PREFIX = '/restaurants';

export const getCuisineTypes = async () => {
    const res = await clientRequest<any>({
        url: `${API_URL_PREFIX}/cuisine-types`,
        method: 'GET',
    });

    return res.data;
};

export const restaurantRoleCustomerApi = {
    onboarding: async (payload: RestaurantOnboardingPayload) => {
        const res = await clientRequest<any>({
            url: `${API_URL_PREFIX}/onboarding`,
            method: 'POST',
            body: payload,
        });

        return res.data;
    },
};
