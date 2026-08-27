'use client';

import { ITableAvailability } from '../types/table-availability.type';
import { ITable } from '@/features/table/types/table.type';

const DAY_LABELS: Record<number, string> = {
    0: 'CN', 1: 'T2', 2: 'T3', 3: 'T4', 4: 'T5', 5: 'T6', 6: 'T7',
};

interface AvailabilityGroupSidebarProps {
    schedules: ITableAvailability[];
    allTables: ITable[];
    selectedId?: string;
    onSelect: (schedule: ITableAvailability) => void;
    onAdd: () => void;
    isLoading?: boolean;
}

function formatWeeklySummary(schedule: ITableAvailability): string {
    const active = (schedule.weeklySlots ?? []).filter((s) => s.isActive !== false);
    if (active.length === 0) return 'Chưa cấu hình';
    const days = active
        .map((s) => DAY_LABELS[s.dayOfWeek])
        .join(', ');
    const first = active[0]?.slots?.[0];
    const timeStr = first ? `${first.startTime}–${first.endTime}` : '';
    return `${days}${timeStr ? ` · ${timeStr}` : ''}`;
}

export default function AvailabilityGroupSidebar({
    schedules,
    allTables,
    selectedId,
    onSelect,
    onAdd,
    isLoading,
}: AvailabilityGroupSidebarProps) {
    if (isLoading) {
        return (
            <div className="flex flex-col gap-3 p-4">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="h-20 animate-pulse rounded-xl bg-[#e8d9c8]" />
                ))}
            </div>
        );
    }

    return (
        <div className="flex h-full flex-col">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#e2ccb0] px-4 py-3">
                <div>
                    <h2 className="text-sm font-bold text-[#4a3728]">Nhóm Khung giờ</h2>
                    <p className="text-xs text-[#9a7a5f]">{schedules.length} lịch đang có</p>
                </div>
                <button
                    type="button"
                    onClick={onAdd}
                    className="flex h-7 w-7 items-center justify-center rounded-full bg-[#6f4e37] text-white shadow hover:bg-[#5a3e2b]"
                    title="Thêm lịch mới"
                >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                    </svg>
                </button>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-3">
                {schedules.length === 0 ? (
                    <div className="flex flex-col items-center gap-3 py-8 text-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#e8d9c8]">
                            <svg className="h-6 w-6 text-[#9a7a5f]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <p className="text-xs text-[#9a7a5f]">Chưa có lịch nào.<br />Nhấn + để tạo mới.</p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-2">
                        {schedules.map((sch, idx) => {
                            const tableCount = sch.tableIds?.length ?? 0;
                            const appliedTables = allTables.filter((t) =>
                                sch.tableIds?.includes(t._id ?? ''),
                            );
                            const isSelected = sch._id === selectedId;
                            const activeCount = (sch.weeklySlots ?? []).filter(
                                (s) => s.isActive !== false,
                            ).length;

                            return (
                                <button
                                    key={sch._id ?? idx}
                                    type="button"
                                    onClick={() => onSelect(sch)}
                                    className={`w-full rounded-xl border p-3 text-left transition-all ${
                                        isSelected
                                            ? 'border-[#6f4e37] bg-[#6f4e37] text-white shadow-md'
                                            : 'border-[#e2ccb0] bg-white text-[#4a3728] hover:border-[#c8a882] hover:bg-[#fdf8f4]'
                                    }`}
                                >
                                    <div className="mb-1.5 flex items-start justify-between gap-2">
                                        <span className={`text-sm font-semibold leading-tight ${isSelected ? 'text-white' : 'text-[#4a3728]'}`}>
                                            Lịch #{String(idx + 1).padStart(2, '0')}
                                        </span>
                                        <span
                                            className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                                                isSelected
                                                    ? 'bg-white/20 text-white'
                                                    : 'bg-[#e8f5e9] text-[#388e3c]'
                                            }`}
                                        >
                                            ACTIVE
                                        </span>
                                    </div>

                                    <p className={`mb-2 text-xs ${isSelected ? 'text-white/80' : 'text-[#9a7a5f]'}`}>
                                        Áp dụng cho {tableCount} bàn
                                    </p>

                                    <div className="flex flex-wrap gap-1">
                                        {activeCount > 0 && (
                                            <span
                                                className={`rounded-full px-2 py-0.5 text-[10px] ${
                                                    isSelected ? 'bg-white/20 text-white' : 'bg-[#f3e5d8] text-[#6f4e37]'
                                                }`}
                                            >
                                                {activeCount} ngày/tuần
                                            </span>
                                        )}
                                        {(sch.exceptions?.length ?? 0) > 0 && (
                                            <span
                                                className={`rounded-full px-2 py-0.5 text-[10px] ${
                                                    isSelected ? 'bg-white/20 text-white' : 'bg-amber-50 text-amber-700'
                                                }`}
                                            >
                                                {sch.exceptions!.length} ngoại lệ
                                            </span>
                                        )}
                                    </div>

                                    {appliedTables.length > 0 && (
                                        <p className={`mt-2 text-[10px] ${isSelected ? 'text-white/70' : 'text-[#b0917a]'}`}>
                                            {appliedTables
                                                .slice(0, 3)
                                                .map((t) => t.tableNumber)
                                                .join(', ')}
                                            {appliedTables.length > 3 && ` +${appliedTables.length - 3}`}
                                        </p>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Footer add button */}
            <div className="border-t border-[#e2ccb0] p-3">
                <button
                    type="button"
                    onClick={onAdd}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-[#c8a882] py-2.5 text-sm font-medium text-[#9a7a5f] transition-colors hover:border-[#6f4e37] hover:bg-[#fdf8f4] hover:text-[#6f4e37]"
                >
                    <span>+</span> Thêm nhóm
                </button>
            </div>
        </div>
    );
}
