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

export const bookingRoleCustomerApi = {
    getAvailableTables: async (restaurantId: string, query: GetAvailableTablesPayload) => {
        const res = await clientRequest<GetAvailableTablesResponse>({
            url: `${API_URL_PREFIX}/${restaurantId}/available-tables`,
            method: 'GET',
            queryParams: query,
        });

        return res;
    },

    getBookingDetail: async (bookingId: string) => {
        const res = await clientRequest<any>({
            url: `${API_URL_PREFIX}/${bookingId}`,
            method: 'GET',
        });

        return res;
    },

    createBooking: async (restaurantId: string, body: CreateBookingPayload) => {
        const res = await clientRequest<any>({
            url: `${API_URL_PREFIX}/${restaurantId}`,
            method: 'POST',
            body,
        });

        return res;
    },

    previewBookingPricing: async (restaurantId: string, body: PreviewBookingPricingPayload) => {
        const res = await clientRequest<PreviewBookingPricingResponse>({
            url: `/pricing-rule/${restaurantId}/pricing-preview`,
            method: 'POST',
            body,
        });

        return res;
    },

    getBookingListById: async () => {
        const res = await clientRequest<any>({
            url: 'list',
            method: 'GET',
        });

        return res;
    },
};
