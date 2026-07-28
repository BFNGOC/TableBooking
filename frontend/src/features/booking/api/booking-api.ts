import { clientRequest } from '@/shared/library/axios/client-api';
import { GetAvailableTablesPayload } from '../types/booking.dto';
import { GetAvailableTablesResponse } from '../types/booking-response';

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
