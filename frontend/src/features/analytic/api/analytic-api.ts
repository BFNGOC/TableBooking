import { clientRequest } from '@/shared/library/axios/client-api';
import { AnalyticResponse, StatisticsQuery } from '../types/analytic.type';

export const analyticApi = {
    getStatistics: async (query: StatisticsQuery) => {
        const response = await clientRequest<AnalyticResponse>({
            url: '/dashboard/analytic',
            method: 'GET',
            queryParams: query,
        });

        return response.data;
    },
};
