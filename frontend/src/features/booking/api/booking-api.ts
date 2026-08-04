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
import { IBooking } from '../types/booking.type';

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

    getBookingListMe: async () => {
        const res = await clientRequest<IBooking[]>({
            url: `${API_URL_PREFIX}/me`,
            method: 'GET',
        });

        return res.data;
    },

    getBookingRecentMe: async () => {
        const res = await clientRequest<IBooking[]>({
            url: `${API_URL_PREFIX}/recent`,
            method: 'GET',
        });

        return res.data;
    },

    getBookingUpcomingMe: async () => {
        const res = await clientRequest<IBooking[]>({
            url: `${API_URL_PREFIX}/upcoming`,
            method: 'GET',
        });

        return res.data;
    },
};

export const bookingRoleRestaurantApi = {
    getUpcoming: async () => {
        const res = await clientRequest<IBooking[]>({
            url: `${API_URL_PREFIX}/restaurant/upcoming`,
            method: 'GET',
        });

        return res.data;
    },

    getAll: async () => {
        const res = await clientRequest<IBooking[]>({
            url: `${API_URL_PREFIX}/restaurant/all`,
            method: 'GET',
        });

        return res.data;
    },
};
