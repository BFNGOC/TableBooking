import { Card } from '@heroui/react';
import { AnalyticResponse } from '../types/analytic.type';

export function TablePerformance({ tables }: { tables: AnalyticResponse['tablePerformance'] }) {
    const max = Math.max(...tables.map((table) => table.bookingCount), 1);
    return (
        <Card className="border-0 bg-white p-5 shadow-[0_8px_24px_rgba(76,53,38,0.06)]">
            <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-[#49382f]">Hiệu suất sử dụng bàn</h2>
                <span className="text-xs text-[#8f6552]">{tables.length} bàn</span>
            </div>
            <div className="mt-6 space-y-4">
                {tables.slice(0, 8).map((table) => (
                    <div key={table.tableId} className="flex items-center gap-3 text-[11px]">
                        <span className="w-20 shrink-0 font-medium text-[#59443a]">
                            {table.tableName}
                        </span>
                        <div className="h-1.5 flex-1 rounded-full bg-[#eee7e1]">
                            <div
                                className="h-full rounded-full bg-[#765341]"
                                style={{ width: `${(table.bookingCount / max) * 100}%` }}
                            />
                        </div>
                        <span className="w-20 text-right text-[#887970]">
                            {table.bookingCount} lượt đặt
                        </span>
                    </div>
                ))}
            </div>
            {tables.length === 0 && (
                <p className="py-6 text-center text-sm text-[#a18f86]">Chưa có dữ liệu bàn</p>
            )}
        </Card>
    );
}
