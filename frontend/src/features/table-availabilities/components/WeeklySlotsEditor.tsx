'use client';

import { IWeeklySlotPayload, ITimeSlotPayload } from '../types/table-availability.type';

const DAY_LABELS = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
const DAY_FULL = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
const ORDERED_DAYS = [1, 2, 3, 4, 5, 6, 0]; // T2 → CN

interface WeeklySlotsEditorProps {
    slots: IWeeklySlotPayload[];
    onChange: (slots: IWeeklySlotPayload[]) => void;
}

const DEFAULT_TIME_SLOT: ITimeSlotPayload = { startTime: '08:00', endTime: '12:00' };

function emptyDay(dayOfWeek: number): IWeeklySlotPayload {
    return { dayOfWeek, isActive: true, slots: [{ ...DEFAULT_TIME_SLOT }] };
}

export default function WeeklySlotsEditor({ slots, onChange }: WeeklySlotsEditorProps) {
    const activedays = new Set(slots.map((s) => s.dayOfWeek));

    const getSlot = (day: number) => slots.find((s) => s.dayOfWeek === day);

    const toggleDay = (day: number) => {
        if (activedays.has(day)) {
            onChange(slots.filter((s) => s.dayOfWeek !== day));
        } else {
            onChange([...slots, emptyDay(day)].sort((a, b) => a.dayOfWeek - b.dayOfWeek));
        }
    };

    const updateSlot = (day: number, updated: IWeeklySlotPayload) => {
        onChange(slots.map((s) => (s.dayOfWeek === day ? updated : s)));
    };

    const addTimeSlot = (day: number) => {
        const slot = getSlot(day);
        if (!slot) return;
        updateSlot(day, { ...slot, slots: [...slot.slots, { startTime: '', endTime: '' }] });
    };

    const removeTimeSlot = (day: number, index: number) => {
        const slot = getSlot(day);
        if (!slot) return;
        updateSlot(day, { ...slot, slots: slot.slots.filter((_, i) => i !== index) });
    };

    const updateTimeSlot = (day: number, index: number, field: 'startTime' | 'endTime', val: string) => {
        const slot = getSlot(day);
        if (!slot) return;
        const newSlots = slot.slots.map((ts, i) => (i === index ? { ...ts, [field]: val } : ts));
        updateSlot(day, { ...slot, slots: newSlots });
    };

    const addDay = () => {
        const nextDay = ORDERED_DAYS.find((d) => !activedays.has(d));
        if (nextDay === undefined) return;
        onChange([...slots, emptyDay(nextDay)].sort((a, b) => a.dayOfWeek - b.dayOfWeek));
    };

    return (
        <div className="flex flex-col gap-3">
            {/* Day column grid */}
            <div className="flex gap-2 overflow-x-auto pb-2">
                {ORDERED_DAYS.filter((d) => activedays.has(d)).map((day) => {
                    const slot = getSlot(day)!;
                    return (
                        <div
                            key={day}
                            className="min-w-[120px] flex-shrink-0 rounded-xl border border-[#c8a882]/40 bg-[#fdf8f4] p-3"
                        >
                            {/* Day header */}
                            <div className="mb-2 flex items-center justify-between">
                                <div className="flex items-center gap-1.5">
                                    <div className="h-2 w-2 rounded-full bg-[#6f4e37]" />
                                    <span className="text-sm font-semibold text-[#4a3728]">
                                        {DAY_FULL[day]}
                                    </span>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => toggleDay(day)}
                                    className="text-xs text-red-400 hover:text-red-600"
                                    title="Xóa ngày này"
                                >
                                    ✕
                                </button>
                            </div>

                            {/* Time slots */}
                            <div className="flex flex-col gap-1.5">
                                {slot.slots.map((ts, i) => (
                                    <div key={i} className="flex items-center gap-1">
                                        <input
                                            type="time"
                                            value={ts.startTime}
                                            onChange={(e) =>
                                                updateTimeSlot(day, i, 'startTime', e.target.value)
                                            }
                                            className="w-full rounded-lg border border-[#d4b896] bg-white px-2 py-1 text-xs text-[#4a3728] focus:border-[#6f4e37] focus:outline-none"
                                        />
                                        <span className="text-xs text-[#9a7a5f]">–</span>
                                        <input
                                            type="time"
                                            value={ts.endTime}
                                            onChange={(e) =>
                                                updateTimeSlot(day, i, 'endTime', e.target.value)
                                            }
                                            className="w-full rounded-lg border border-[#d4b896] bg-white px-2 py-1 text-xs text-[#4a3728] focus:border-[#6f4e37] focus:outline-none"
                                        />
                                        {slot.slots.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeTimeSlot(day, i)}
                                                className="ml-1 text-xs text-red-400 hover:text-red-600"
                                            >
                                                ✕
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Add time slot */}
                            <button
                                type="button"
                                onClick={() => addTimeSlot(day)}
                                className="mt-2 w-full rounded-lg border border-dashed border-[#c8a882] py-1 text-xs text-[#9a7a5f] hover:border-[#6f4e37] hover:text-[#6f4e37]"
                            >
                                + Thêm giờ
                            </button>
                        </div>
                    );
                })}

                {/* Add day card */}
                {ORDERED_DAYS.some((d) => !activedays.has(d)) && (
                    <button
                        type="button"
                        onClick={addDay}
                        className="flex min-w-[100px] flex-shrink-0 flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-[#c8a882] p-3 text-[#9a7a5f] hover:border-[#6f4e37] hover:text-[#6f4e37]"
                    >
                        <span className="text-2xl font-light">+</span>
                        <span className="text-xs">Thêm ngày</span>
                    </button>
                )}
            </div>

            {/* Day toggles */}
            <div className="flex flex-wrap gap-1.5">
                {ORDERED_DAYS.map((d) => (
                    <button
                        key={d}
                        type="button"
                        onClick={() => toggleDay(d)}
                        className={`rounded-full px-3 py-1 text-xs font-semibold transition-all ${
                            activedays.has(d)
                                ? 'bg-[#6f4e37] text-white shadow-sm'
                                : 'border border-[#d4b896] bg-white text-[#9a7a5f] hover:border-[#6f4e37]'
                        }`}
                    >
                        {DAY_LABELS[d]}
                    </button>
                ))}
            </div>
        </div>
    );
}
