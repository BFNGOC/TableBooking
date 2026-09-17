import { clientRequest } from '@/shared/library/axios/client-api';
import {
    ITableAvailability,
    CreateTableAvailabilityPayload,
    UpdateTableAvailabilityPayload,
} from '../types/table-availability.type';

const API_URL_PREFIX = '/table-availabilities';

export const tableAvailabilityApi = {
    /** RESTAURANT: lấy toàn bộ availability schedules của nhà hàng */
    getMy: async () => {
        const res = await clientRequest<ITableAvailability[]>({
            url: `${API_URL_PREFIX}/my`,
            method: 'GET',
        });
        return res.data;
    },

    /** CUSTOMER/RESTAURANT: lấy chi tiết 1 schedule */
    getOne: async (id: string) => {
        const res = await clientRequest<ITableAvailability>({
            url: `${API_URL_PREFIX}/${id}`,
            method: 'GET',
        });
        return res.data;
    },

    /** RESTAURANT: tạo mới */
    create: async (payload: CreateTableAvailabilityPayload) => {
        const res = await clientRequest<ITableAvailability>({
            url: API_URL_PREFIX,
            method: 'POST',
            body: payload,
        });
        return res.data;
    },

    /** RESTAURANT: cập nhật */
    update: async (id: string, payload: UpdateTableAvailabilityPayload) => {
        const res = await clientRequest<ITableAvailability>({
            url: `${API_URL_PREFIX}/${id}`,
            method: 'PATCH',
            body: payload,
        });
        return res.data;
    },

    /** RESTAURANT: xóa */
    remove: async (id: string) => {
        const res = await clientRequest<{ message: string }>({
            url: `${API_URL_PREFIX}/${id}`,
            method: 'DELETE',
        });
        return res.data;
    },
};
