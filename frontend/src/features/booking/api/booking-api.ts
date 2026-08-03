import { clientRequest } from '@/shared/library/axios/client-api';
import {
    CreateBookingPayload,
    GetAvailableTablesPayload,
    PreviewBookingPricingPayload,
} from '../types/booking.dto';
import {
    GetAvailableTablesResponse,
    PreviewBookingPricingResponse,
} from '../types/booking-response';

const API_URL_PREFIX = '/bookings';

export const getAvailableTablesApi = async (
    restaurantId: string,
    query: GetAvailableTablesPayload
) => {
    const res = await clientRequest<GetAvailableTablesResponse>({
        url: `${API_URL_PREFIX}/${restaurantId}/available-tables`,
        method: 'GET',
        queryParams: query,
    });

    return res;
};

export const getBookingMe = async (restaurantId: string) => {
    const res = await clientRequest<any>({
        url: `${API_URL_PREFIX}/${restaurantId}`,
        method: 'GET',
    });

    return res;
};

export const createBookingApi = async (restaurantId: string, body: CreateBookingPayload) => {
    const res = await clientRequest<any>({
        url: `${API_URL_PREFIX}/${restaurantId}`,
        method: 'POST',
        body,
    });

    return res;
};

export const previewBookingPricingApi = async (
    restaurantId: string,
    body: PreviewBookingPricingPayload
) => {
    const res = await clientRequest<PreviewBookingPricingResponse>({
        url: `/pricing-rule/${restaurantId}/pricing-preview`,
        method: 'POST',
        body,
    });

    return res;
};
