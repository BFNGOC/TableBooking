import {
    ArrowDownRight,
    ArrowUpRight,
    CalendarDays,
    CircleDollarSign,
    UserRound,
    XCircle,
} from 'lucide-react';
import { Card } from '@heroui/react';
import { AnalyticResponse } from '../types/analytic.type';

const formatMoney = (value: number) =>
    `${(value / 1000000).toLocaleString('vi-VN', { maximumFractionDigits: 1 })}M`;

export function AnalyticOverviewCards({ overview }: { overview: AnalyticResponse['overview'] }) {
    const items = [
        [
            'Tổng số đặt bàn',
            overview.totalBookings,
            overview.totalBookings.current.toLocaleString('vi-VN'),
            CalendarDays,
            'bg-[#eee7e1]',
        ],
        [
            'Doanh thu ước tính',
            overview.estimatedRevenue,
            formatMoney(overview.estimatedRevenue.current),
            CircleDollarSign,
            'bg-[#eef0e7]',
        ],
        [
            'Khách hàng mới',
            overview.newCustomers,
            overview.newCustomers.current.toLocaleString('vi-VN'),
            UserRound,
            'bg-[#e8edef]',
        ],
        [
            'Tỷ lệ hủy',
            overview.cancellationRate,
            `${overview.cancellationRate.current.toFixed(1)}%`,
            XCircle,
            'bg-[#fae7e5]',
        ],
    ] as const;
    return (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {items.map(([label, metric, value, Icon, tone]) => {
                const positive = metric.change.percentage >= 0;
                return (
                    <Card
                        key={label}
                        className="border-0 bg-white p-5 shadow-[0_8px_24px_rgba(76,53,38,0.06)]"
                    >
                        <div className="flex justify-between">
                            <span
                                className={`flex h-9 w-9 items-center justify-center rounded-xl ${tone}`}
                            >
                                <Icon size={16} className="text-[#765341]" />
                            </span>
                            <span
                                className={`flex items-center text-[10px] font-semibold ${positive ? 'text-emerald-600' : 'text-rose-500'}`}
                            >
                                {positive ? (
                                    <ArrowUpRight size={13} />
                                ) : (
                                    <ArrowDownRight size={13} />
                                )}
                                {Math.abs(metric.change.percentage).toFixed(1)}%
                            </span>
                        </div>
                        <p className="mt-5 text-[10px] font-semibold uppercase tracking-wider text-[#aa9991]">
                            {label}
                        </p>
                        <p className="mt-1 text-2xl font-bold text-[#3e302a]">{value}</p>
                        {label === 'Doanh thu ước tính' && (
                            <p className="mt-1 text-[10px] font-semibold text-[#846e61]">VND</p>
                        )}
                    </Card>
                );
            })}
        </div>
    );
}
