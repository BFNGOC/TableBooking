export type StatisticsPeriod =
    | 'today'
    | '7d'
    | '30d'
    | 'thisMonth'
    | 'lastMonth'
    | 'year'
    | 'custom';

export interface StatisticsQuery {
    period: StatisticsPeriod;
    fromDate?: string;
    toDate?: string;
}

export interface AnalyticMetric {
    current: number;
    previous: number;
    change: { difference: number; percentage: number };
}

export interface AnalyticResponse {
    overview: {
        totalBookings: AnalyticMetric;
        estimatedRevenue: AnalyticMetric;
        newCustomers: AnalyticMetric;
        cancellationRate: AnalyticMetric;
    };
    bookingTrend: { date: string; value: number }[];
    revenueTrend: { date: string; value: number }[];
    bookingStatus: { status: string; value: number }[];
    popularBookingHours: { hour: number; value: number }[];
    tablePerformance: { tableId: string; tableName: string; bookingCount: number }[];
}
