import { Card } from '@heroui/react';
import { BookingStatusStats } from '../types/dashboard.type';

export function BookingStatusCard({ status }: { status: BookingStatusStats }) {
    const rows = [
        ['Đã xác nhận', status.confirmed, 'bg-[#765341]'],
        ['Đang chờ', status.pending, 'bg-[#d29b7d]'],
        ['Check-in', status.checkedIn, 'bg-[#436a3d]'],
        ['Đã huỷ', status.cancelled, 'bg-[#a35252]'],
        ['No show', status.noShow, 'bg-[#7a828a]'],
    ];

    const total = rows.reduce((sum, [, value]) => sum + Number(value), 0) || 1;
    return (
        <Card className="border-0 bg-white p-5 shadow-[0_8px_24px_rgba(76,53,38,0.06)]">
            <h2 className="text-base font-bold text-[#49382f]">Trạng thái đặt bàn</h2>
            <div className="mt-7 space-y-5">
                {rows.map(([label, value, color]) => (
                    <div key={label as string}>
                        <div className="mb-2 flex justify-between text-[10px] font-semibold uppercase text-[#907a70]">
                            <span>{label}</span>
                            <span className="text-[#59443a]">{value}</span>
                        </div>
                        <div className="h-1.5 overflow-hidden rounded-full bg-[#f1e9e5]">
                            <div
                                className={`h-full rounded-full ${color}`}
                                style={{ width: `${(Number(value) / total) * 100}%` }}
                            />
                        </div>
                    </div>
                ))}
            </div>
            <p className="mt-7 text-[10px] italic text-[#b3a29a]">
                * Dữ liệu được cập nhật theo tháng hiện tại
            </p>
        </Card>
    );
}
