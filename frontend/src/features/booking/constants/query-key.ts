import { GetAvailableTablesPayload } from '../types/booking.dto';

export const bookingQueryKeys = {
    GET_AVAILABLE_TABLES: (restaurantId: string, query: GetAvailableTablesPayload) => [
        'available-tables',
        restaurantId,
        query,
    ],
    GET_BOOKING_DETAIL: (bookingId: string) => ['booking', bookingId],
    GET_BOOKING_LIST_ME: ['booking', 'list', 'me'],
    GET_BOOKING_UPCOMING_ME: ['booking', 'upcoming', 'me'],
    GET_BOOKING_RECENT_ME: ['booking', 'recent', 'me'],
};
