import { clientRequest } from '@/shared/library/axios/client-api';
import { RestaurantOnboardingPayload } from '../types/restaurant.dto';
import { IRestaurant } from '../types/restaurant.type';

const API_URL_PREFIX = '/restaurants';

export const getCuisineTypesApi = async () => {
    const res = await clientRequest<any>({
        url: `${API_URL_PREFIX}/cuisine-types`,
        method: 'GET',
    });

    return res.data;
};

export const getRestaurantMeApi = async () => {
    const res = await clientRequest<IRestaurant>({
        url: `${API_URL_PREFIX}/me`,
        method: 'GET',
    });
    return res.data;
};

export const restaurantRoleCustomerApi = {
    onboarding: async (payload: RestaurantOnboardingPayload) => {
        const res = await clientRequest<IRestaurant>({
            url: `${API_URL_PREFIX}/onboarding`,
            method: 'POST',
            body: payload,
        });

        return res.data;
    },
    verifyEmail: async (payload: { _id: string; code: string }) => {
        const res = await clientRequest<IRestaurant>({
            url: `${API_URL_PREFIX}/verify-email`,
            method: 'POST',
            body: payload,
        });

        return res.data;
    },
    resendVerifyEmail: async () => {
        const res = await clientRequest({
            url: `${API_URL_PREFIX}/resend-email`,
            method: 'POST',
        });

        return res.data;
    },
};
