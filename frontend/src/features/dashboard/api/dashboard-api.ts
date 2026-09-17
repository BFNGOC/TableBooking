import { clientRequest } from '@/shared/library/axios/client-api';
import { DashboardPeriod, DashboardResponse } from '../types/dashboard.type';

export const dashboardApi = {
    getDashboard: async (period: DashboardPeriod = 'week') => {
        const response = await clientRequest<DashboardResponse>({
            url: '/dashboard',
            method: 'GET',
            queryParams: { period },
        });

        return response.data;
    },
};
