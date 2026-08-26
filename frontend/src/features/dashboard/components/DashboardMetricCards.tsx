import {
    ArrowDownRight,
    ArrowUpRight,
    CalendarDays,
    CircleDollarSign,
    Users,
    XCircle,
} from 'lucide-react';
import { Card } from '@heroui/react';
import { DashboardMetric } from '../types/dashboard.type';

interface DashboardMetricCardsProps {
    booking: DashboardMetric;
    revenue: DashboardMetric;
    payingCustomer: DashboardMetric;
    cancellation: DashboardMetric;
}

const formatRevenue = (value: number) =>
    `${(value / 1000000).toLocaleString('vi-VN', { maximumFractionDigits: 1 })}M`;

export function DashboardMetricCards({
    booking,
    revenue,
    payingCustomer,
    cancellation,
}: DashboardMetricCardsProps) {
    const metrics = [
        {
            label: 'Tổng booking (tháng)',
            value: booking.current.toLocaleString('vi-VN'),
            change: booking.change.percentage,
            icon: CalendarDays,
            tone: 'bg-[#fbe4d6]',
        },
        {
            label: 'Doanh thu tháng',
            value: formatRevenue(revenue.current),
            change: revenue.change.percentage,
            icon: CircleDollarSign,
            tone: 'bg-[#e4eee6]',
        },
        {
            label: 'Khách hàng mới',
            value: payingCustomer.current.toLocaleString('vi-VN'),
            change: payingCustomer.change.percentage,
            icon: XCircle,
            tone: 'bg-[#eee5ef]',
        },
        {
            label: 'Tỷ lệ hủy',
            value: `${Math.max(0, 100 - cancellation.current).toFixed(1)}%`,
            change: -cancellation.change.percentage,
            icon: Users,
            tone: 'bg-[#dcecf0]',
        },
    ];

    return (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {metrics.map(({ label, value, change, icon: Icon, tone }) => {
                const positive = change >= 0;
                return (
                    <Card
                        key={label}
                        className="border-0 bg-white p-5 shadow-[0_8px_24px_rgba(76,53,38,0.06)]"
                    >
                        <div className="flex items-start justify-between">
                            <div
                                className={`flex h-11 w-11 items-center justify-center rounded-2xl bg-${tone}-100`}
                            >
                                <Icon size={19} strokeWidth={1.8} className="text-[#765341]" />
                            </div>
                            <span
                                className={`flex items-center gap-0.5 rounded-full px-2 py-1 text-[11px] font-semibold ${positive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-500'}`}
                            >
                                {positive ? (
                                    <ArrowUpRight size={13} />
                                ) : (
                                    <ArrowDownRight size={13} />
                                )}
                                {Math.abs(change).toFixed(1)}%
                            </span>
                        </div>
                        <p className="mt-5 text-[11px] font-medium uppercase tracking-[0.08em] text-[#a18f86]">
                            {label}
                        </p>
                        <p className="mt-1 text-2xl font-bold text-[#3e302a]">{value}</p>
                    </Card>
                );
            })}
        </div>
    );
}
