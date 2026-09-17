import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '../api/dashboard-api';
import { dashboardQueryKeys } from '../constants/query-key';
import { DashboardPeriod, DashboardResponse } from '../types/dashboard.type';

export function useDashboard(period: DashboardPeriod) {
    return useQuery<DashboardResponse>({
        queryKey: dashboardQueryKeys.detail(period),
        queryFn: () => dashboardApi.getDashboard(period),
        staleTime: 60 * 1000,
        refetchOnWindowFocus: true,
        retry: 1,
    });
}
