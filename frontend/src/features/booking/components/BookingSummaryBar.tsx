'use client';

import { Button } from '@heroui/react';

import { ITableDetail } from '../types/booking-response';

interface BookingSummaryBarProps {
    selectedTables: ITableDetail[];
    selectedAreaNames: string[];
    selectedCapacity: number;
    bookingDate?: string;
    startTime?: string;
    onContinue: () => void;
}

function BookingSummaryBar({
    selectedTables,
    selectedAreaNames,
    selectedCapacity,
    bookingDate,
    startTime,
    onContinue,
}: BookingSummaryBarProps) {
    const hasSelection = selectedTables.length > 0;
    const depositTotal = selectedTables.reduce(
        (total, table) => total + (table.depositAmount ?? 0),
        0
    );

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 px-3 pb-3 sm:px-6 sm:pb-4">
            <div className="mx-auto flex max-w-7xl items-center gap-4 rounded-[28px] border border-white/10 bg-[#6f4e37] px-5 py-3 text-white shadow-[0_20px_45px_rgba(111,78,55,0.24)] sm:px-7">
                <div className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/10 sm:flex">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="h-5 w-5"
                    >
                        <path d="M4 10h16" />
                        <path d="M6 10v8" />
                        <path d="M18 10v8" />
                        <path d="M4 18h16" />
                        <path d="M8 10V6h8v4" />
                    </svg>
                </div>

                <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#d8c2b5]">
                        Bàn đã chọn
                    </p>

                    {hasSelection ? (
                        <div className="mt-0.5">
                            <p className="truncate text-base font-bold sm:text-lg">
                                {selectedTables.length > 1
                                    ? `${selectedTables.length} bàn đã chọn`
                                    : `Bàn số ${selectedTables[0].tableNumber}`}
                                {selectedAreaNames.length > 0 &&
                                    ` — ${selectedAreaNames.join(', ')}`}
                            </p>

                            <p className="text-xs text-[#f7ede2] sm:text-sm">
                                {selectedTables.length > 1
                                    ? `${selectedCapacity} người tổng sức chứa`
                                    : `${selectedTables[0].capacity} người`}
                            </p>
                        </div>
                    ) : (
                        <p className="mt-1 text-sm text-[#f7ede2]">Chưa có bàn được chọn</p>
                    )}
                </div>

                {hasSelection && (
                    <div className="hidden shrink-0 text-right md:block">
                        <p className="text-xs text-[#d8c2b5]">
                            {bookingDate}, {startTime}
                        </p>

                        <p className="text-sm font-semibold">
                            Phí giữ chỗ: {depositTotal.toLocaleString()}đ
                        </p>
                    </div>
                )}

                <Button
                    type="button"
                    size="lg"
                    isDisabled={!hasSelection}
                    onPress={onContinue}
                    className="shrink-0 rounded-full bg-white px-6 font-semibold text-[#6f4e37] shadow-sm hover:bg-[#f3e8e0] disabled:opacity-50 sm:px-8"
                >
                    <span>Tiếp tục điền thông tin</span>
                    <span className="ml-2 text-xl leading-none">→</span>
                </Button>
            </div>
        </div>
    );
}

export default BookingSummaryBar;
