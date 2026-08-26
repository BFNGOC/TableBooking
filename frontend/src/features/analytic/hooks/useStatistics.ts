import { useQuery } from '@tanstack/react-query';
import { analyticApi } from '../api/analytic-api';
import { analyticQueryKeys } from '../constants/query-key';
import { StatisticsQuery, AnalyticResponse } from '../types/analytic.type';

export function useStatistics(query: StatisticsQuery) {
    return useQuery<AnalyticResponse>({
        queryKey: analyticQueryKeys.statistics(query),
        queryFn: () => analyticApi.getStatistics(query),
        enabled: query.period !== 'custom' || Boolean(query.fromDate && query.toDate),
        staleTime: 60 * 1000,
        refetchOnWindowFocus: true,
        retry: 1,
    });
}
