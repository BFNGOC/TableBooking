import { Card } from '@heroui/react';
import { AnalyticResponse } from '../types/analytic.type';

const dayLabel = (date: string) => {
    const [, month, day] = date.split('-');
    return `${day}/${month}`;
};
const money = (value: number) =>
    `${(value / 1000000).toLocaleString('vi-VN', { maximumFractionDigits: 1 })}M`;

function Bars({
    values,
    color,
    labels,
    formatter = String,
}: {
    values: number[];
    color: string;
    labels: string[];
    formatter?: (value: number) => string;
}) {
    const max = Math.max(...values, 1);
    return (
        <div className="mt-7 w-full min-w-0 overflow-x-auto pb-1">
            <div
                className="flex h-40 items-end gap-2"
                style={{ minWidth: `${Math.max(values.length * 44, 520)}px` }}
            >
                {values.map((value, index) => (
                    <div
                        className="flex h-full min-w-8 flex-1 flex-col items-center justify-end gap-2"
                        key={`${labels[index]}-${index}`}
                    >
                        <span className="text-[9px] text-[#887970]">
                            {value ? formatter(value) : ''}
                        </span>
                        <div
                            className={`w-full max-w-8 rounded-t-sm ${color}`}
                            style={{ height: `${Math.max((value / max) * 100, value ? 8 : 2)}%` }}
                        />
                        <span className="text-[9px] text-[#a18f86]">{labels[index]}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

export function AnalyticCharts({ data }: { data: AnalyticResponse }) {
    const bookingLabels = data.bookingTrend.map((item) => dayLabel(item.date));
    return (
        <div className="grid min-w-0 gap-5 xl:grid-cols-2">
            <Card className="min-w-0 border-0 bg-white p-5 shadow-[0_8px_24px_rgba(76,53,38,0.06)]">
                <h2 className="text-base font-bold text-[#49382f]">Xu hướng đặt bàn</h2>
                <Bars
                    values={data.bookingTrend.map((item) => item.value)}
                    labels={bookingLabels}
                    color="bg-[#765341]"
                />
            </Card>
            <Card className="min-w-0 border-0 bg-white p-5 shadow-[0_8px_24px_rgba(76,53,38,0.06)]">
                <h2 className="text-base font-bold text-[#49382f]">Xu hướng doanh thu</h2>
                <Bars
                    values={data.revenueTrend.map((item) => item.value)}
                    labels={data.revenueTrend.map((item) => dayLabel(item.date))}
                    color="bg-[#858878]"
                    formatter={money}
                />
            </Card>
        </div>
    );
}

export function AnalyticDetailCharts({ data }: { data: AnalyticResponse }) {
    const maxHour = Math.max(...data.popularBookingHours.map((item) => item.value), 1);
    const total = data.bookingStatus.reduce((sum, item) => sum + item.value, 0) || 1;
    return (
        <div className="grid min-w-0 gap-5 xl:grid-cols-2">
            <Card className="min-w-0 border-0 bg-white p-5 shadow-[0_8px_24px_rgba(76,53,38,0.06)]">
                <h2 className="text-base font-bold text-[#49382f]">Phân tích trạng thái đặt bàn</h2>
                <div className="mt-6 space-y-4">
                    {data.bookingStatus.map((item) => (
                        <div key={item.status}>
                            <div className="mb-1 flex justify-between text-[10px] text-[#765f54]">
                                <span>{statusLabels[item.status] ?? item.status}</span>
                                <span>
                                    {item.value} ({Math.round((item.value / total) * 100)}%)
                                </span>
                            </div>
                            <div className="h-2 rounded-full bg-[#eee7e1]">
                                <div
                                    className="h-full rounded-full bg-[#765341]"
                                    style={{ width: `${(item.value / total) * 100}%` }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </Card>
            <Card className="min-w-0 border-0 bg-white p-5 shadow-[0_8px_24px_rgba(76,53,38,0.06)]">
                <h2 className="text-base font-bold text-[#49382f]">
                    Khung giờ được đặt nhiều nhất
                </h2>
                <div className="mt-7 overflow-x-auto pb-1">
                    <div className="flex h-40 min-w-130 items-end gap-1.5">
                        {data.popularBookingHours.map((item) => (
                            <div
                                key={item.hour}
                                className="flex h-full min-w-4 flex-1 flex-col items-center justify-end gap-2"
                            >
                                <div
                                    className="w-full rounded-t-sm bg-[#765341]"
                                    style={{
                                        height: `${Math.max((item.value / maxHour) * 100, 8)}%`,
                                    }}
                                />
                                <span className="text-[9px] text-[#a18f86]">{item.hour}h</span>
                            </div>
                        ))}
                    </div>
                </div>
            </Card>
        </div>
    );
}

const statusLabels: Record<string, string> = {
    PENDING: 'Đang chờ',
    CONFIRMED: 'Đã xác nhận',
    CHECKED_IN: 'Đã check-in',
    COMPLETED: 'Hoàn tất',
    CANCELLED: 'Đã hủy',
    REJECTED: 'Đã từ chối',
    NO_SHOW: 'Không đến',
};
