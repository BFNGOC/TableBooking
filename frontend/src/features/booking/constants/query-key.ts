import { GetAvailableTablesPayload } from '../types/booking.dto';

export const bookingQueryKeys = {
    GET_AVAILABLE_TABLES: (restaurantId: string, query: GetAvailableTablesPayload) => [
        'available-tables',
        restaurantId,
        query,
    ],
};
