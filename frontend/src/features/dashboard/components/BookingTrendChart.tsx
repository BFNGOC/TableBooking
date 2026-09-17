import { Card } from '@heroui/react';
import { BookingTrendItem, DashboardPeriod } from '../types/dashboard.type';

interface BookingTrendChartProps {
    data: BookingTrendItem[];
    period: DashboardPeriod;
    onPeriodChange: (period: DashboardPeriod) => void;
}

export function BookingTrendChart({ data, period, onPeriodChange }: BookingTrendChartProps) {
    const max = Math.max(...data.map((item) => item.total), 1);
    return (
        <Card className="border-0 bg-white p-5 shadow-[0_8px_24px_rgba(76,53,38,0.06)]">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h2 className="text-base font-bold text-[#49382f]">Xu hướng đặt bàn</h2>
                    <p className="mt-1 text-xs text-[#a18f86]">Theo dõi lượng booking trong kỳ</p>
                </div>
                <div className="flex rounded-lg bg-[#f8f4f1] p-1">
                    {(['week', 'month'] as DashboardPeriod[]).map((item) => (
                        <button
                            key={item}
                            type="button"
                            onClick={() => onPeriodChange(item)}
                            className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${period === item ? 'bg-white text-[#6f4e37] shadow-sm' : 'text-[#aa9991]'}`}
                        >
                            {item === 'week' ? '7 ngày qua' : 'Tháng này'}
                        </button>
                    ))}
                </div>
            </div>
            <div className="mt-8 flex h-44 items-end gap-2 sm:gap-5">
                {data.map((item) => (
                    <div
                        key={item.day}
                        className="flex h-full flex-1 flex-col items-center justify-end gap-2"
                    >
                        <span className="text-[10px] font-semibold text-[#8b7163]">
                            {item.total || ''}
                        </span>
                        <div
                            className="w-full max-w-8 rounded-t-md bg-[#d9b39e] transition-all"
                            style={{
                                height: `${Math.max((item.total / max) * 100, item.total ? 7 : 2)}%`,
                            }}
                        />
                        <span className="text-[10px] text-[#a18f86]">{item.label}</span>
                    </div>
                ))}
            </div>
        </Card>
    );
}
