'use client';

import { useState } from 'react';
import { Button, Skeleton } from '@heroui/react';
import { RefreshCw } from 'lucide-react';
import { useDashboard } from '../hooks/useDashboard';
import { useRestaurantMe } from '@/features/restaurant/hooks/useRestaurantMe';
import { DashboardPeriod } from '../types/dashboard.type';
import { DashboardMetricCards } from '../components/DashboardMetricCards';
import { BookingTrendChart } from '../components/BookingTrendChart';
import { BookingStatusCard } from '../components/BookingStatusCard';
import { UpcomingBookingsTable } from '../components/UpcomingBookingsTable';

function DashboardRestaurantPage() {
    const [period, setPeriod] = useState<DashboardPeriod>('week');
    const dashboard = useDashboard(period);
    const restaurant = useRestaurantMe();
    const name = restaurant.data?.restaurantName ?? 'nhà hàng của bạn';

    if (dashboard.isPending) {
        return (
            <div className="space-y-5">
                <Skeleton className="h-20 rounded-2xl" />
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {[1, 2, 3, 4].map((item) => (
                        <Skeleton key={item} className="h-36 rounded-2xl" />
                    ))}
                </div>
                <Skeleton className="h-80 rounded-2xl" />
                <Skeleton className="h-64 rounded-2xl" />
            </div>
        );
    }

    if (dashboard.isError || !dashboard.data) {
        return (
            <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
                <p className="text-lg font-semibold text-[#49382f]">
                    Không thể tải dữ liệu dashboard
                </p>
                <p className="text-sm text-[#9a877e]">Vui lòng thử lại sau ít phút.</p>
                <Button variant="primary" onPress={() => dashboard.refetch()}>
                    <RefreshCw size={16} /> Thử lại
                </Button>
            </div>
        );
    }

    const data = dashboard.data;
    return (
        <div className="mx-auto max-w-350 space-y-5 pb-8">
            <header className="flex flex-wrap items-end justify-between gap-4">
                <div>
                    <p className="text-sm text-[#9b867b]">Thứ Tư, ngày 26 tháng 8 năm 2026</p>
                    <h1 className="mt-1 text-2xl font-bold tracking-tight text-[#49382f]">
                        Tổng quan nhà hàng {name}
                    </h1>
                </div>
                <Button variant="secondary" size="sm" onPress={() => dashboard.refetch()}>
                    <RefreshCw size={15} /> Làm mới
                </Button>
            </header>
            <DashboardMetricCards
                booking={data.booking}
                revenue={data.revenue}
                payingCustomer={data.payingCustomer}
                cancellation={data.cancellation}
            />
            <div className="grid gap-5 xl:grid-cols-[minmax(0,1.65fr)_minmax(280px,.85fr)]">
                <BookingTrendChart
                    data={data.bookingTrend}
                    period={period}
                    onPeriodChange={setPeriod}
                />
                <BookingStatusCard status={data.bookingStatus} />
            </div>
            <UpcomingBookingsTable bookings={data.upcomingBookings} />
        </div>
    );
}

export default DashboardRestaurantPage;
