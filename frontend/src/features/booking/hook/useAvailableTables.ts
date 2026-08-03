import { useQuery } from '@tanstack/react-query';
import { getAvailableTablesApi } from '../api/booking-api';
import { bookingQueryKeys } from '../constants/query-key';
import { GetAvailableTablesPayload } from '../types/booking.dto';

export function useGetAvailableTables(restaurantId: string, params?: GetAvailableTablesPayload) {
    return useQuery({
        queryKey: [bookingQueryKeys.GET_AVAILABLE_TABLES, restaurantId, params],
        queryFn: () => getAvailableTablesApi(restaurantId, params!),
        enabled: Boolean(restaurantId && params),
        retry: false,
    });
}
