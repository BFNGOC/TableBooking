'use client';

import { useState } from 'react';
import { Button, Card, Skeleton } from '@heroui/react';
import { RefreshCw } from 'lucide-react';
import { useStatistics } from '../hooks/useStatistics';
import { StatisticsPeriod } from '../types/analytic.type';
import { useRestaurantMe } from '@/features/restaurant/hooks/useRestaurantMe';
import { AnalyticOverviewCards } from '../components/AnalyticOverviewCards';
import { AnalyticCharts, AnalyticDetailCharts } from '../components/AnalyticCharts';
import { TablePerformance } from '../components/TablePerformance';

const periods: { value: StatisticsPeriod; label: string }[] = [
    { value: 'today', label: 'Hôm nay' },
    { value: '7d', label: '7 ngày' },
    { value: '30d', label: '30 ngày' },
    { value: 'thisMonth', label: 'Tháng này' },
    { value: 'lastMonth', label: 'Tháng trước' },
    { value: 'year', label: 'Năm nay' },
];

function AnalyticRestaurantPage() {
    const restaurant = useRestaurantMe();
    const [period, setPeriod] = useState<StatisticsPeriod>('7d');
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [appliedRange, setAppliedRange] = useState<{ fromDate: string; toDate: string } | null>(
        null
    );
    const query =
        period === 'custom' && appliedRange
            ? { period, ...appliedRange }
            : period === 'custom'
              ? { period: '7d' as const }
              : { period };
    const statistics = useStatistics(query);
    const name = restaurant.data?.restaurantName ?? 'nhà hàng của bạn';

    if (statistics.isPending) {
        return (
            <div className="space-y-5">
                <Skeleton className="h-20 rounded-2xl" />
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {[1, 2, 3, 4].map((item) => (
                        <Skeleton key={item} className="h-36 rounded-2xl" />
                    ))}
                </div>
                <div className="grid gap-5 xl:grid-cols-2">
                    <Skeleton className="h-64 rounded-2xl" />
                    <Skeleton className="h-64 rounded-2xl" />
                </div>
            </div>
        );
    }

    if (statistics.isError || !statistics.data) {
        return (
            <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
                <p className="text-lg font-semibold text-[#49382f]">
                    Không thể tải dữ liệu phân tích
                </p>
                <Button variant="primary" onPress={() => statistics.refetch()}>
                    <RefreshCw size={16} /> Thử lại
                </Button>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-350 space-y-5 pb-8">
            <header className="flex flex-wrap items-end justify-between gap-4">
                <div>
                    <p className="text-sm text-[#9b867b]">Phân tích hiệu suất và hoạt động</p>
                    <h1 className="mt-1 text-2xl font-bold tracking-tight text-[#49382f]">
                        Báo cáo nhà hàng {name}
                    </h1>
                </div>
                <Button variant="secondary" size="sm" onPress={() => statistics.refetch()}>
                    <RefreshCw size={15} /> Làm mới
                </Button>
            </header>
            <Card className="flex flex-wrap items-center gap-2 border-0 bg-white p-3 shadow-[0_8px_24px_rgba(76,53,38,0.06)]">
                <div className="flex flex-wrap gap-1 rounded-lg bg-[#f8f4f1] p-1">
                    {periods.map((item) => (
                        <button
                            key={item.value}
                            type="button"
                            onClick={() => {
                                setPeriod(item.value);
                                setAppliedRange(null);
                            }}
                            className={`rounded-md px-3 py-2 text-xs font-semibold ${period === item.value ? 'bg-[#765341] text-white' : 'text-[#89766b]'}`}
                        >
                            {item.label}
                        </button>
                    ))}
                    <button
                        type="button"
                        onClick={() => {
                            setPeriod('custom');
                            setAppliedRange(null);
                        }}
                        className={`rounded-md px-3 py-2 text-xs font-semibold ${period === 'custom' ? 'bg-[#765341] text-white' : 'text-[#89766b]'}`}
                    >
                        Tùy chọn
                    </button>
                </div>
                {period === 'custom' && (
                    <div className="flex flex-wrap items-center gap-2">
                        <input
                            aria-label="Từ ngày"
                            type="date"
                            value={fromDate}
                            onChange={(event) => setFromDate(event.target.value)}
                            className="rounded-lg border border-[#e7ddd8] px-3 py-2 text-xs text-[#59443a]"
                        />
                        <span className="text-xs text-[#a18f86]">đến</span>
                        <input
                            aria-label="Đến ngày"
                            type="date"
                            value={toDate}
                            onChange={(event) => setToDate(event.target.value)}
                            className="rounded-lg border border-[#e7ddd8] px-3 py-2 text-xs text-[#59443a]"
                        />
                        <Button
                            size="sm"
                            variant="primary"
                            isDisabled={!fromDate || !toDate || fromDate > toDate}
                            onPress={() => setAppliedRange({ fromDate, toDate })}
                        >
                            Áp dụng
                        </Button>
                    </div>
                )}
            </Card>
            <AnalyticOverviewCards overview={statistics.data.overview} />
            <AnalyticCharts data={statistics.data} />
            <AnalyticDetailCharts data={statistics.data} />
            <TablePerformance tables={statistics.data.tablePerformance} />
        </div>
    );
}

export default AnalyticRestaurantPage;
