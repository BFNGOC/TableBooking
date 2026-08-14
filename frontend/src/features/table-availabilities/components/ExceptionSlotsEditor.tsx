'use client';

import { IExceptionSlotPayload, ITimeSlotPayload } from '../types/table-availability.type';

interface ExceptionSlotsEditorProps {
    exceptions: IExceptionSlotPayload[];
    onChange: (exceptions: IExceptionSlotPayload[]) => void;
}

function emptyException(): IExceptionSlotPayload {
    return {
        date: new Date().toISOString().split('T')[0],
        reason: '',
        isClosed: false,
        slots: [{ startTime: '08:00', endTime: '12:00' }],
    };
}

export default function ExceptionSlotsEditor({ exceptions, onChange }: ExceptionSlotsEditorProps) {
    const add = () => onChange([...exceptions, emptyException()]);

    const remove = (index: number) => onChange(exceptions.filter((_, i) => i !== index));

    const update = (index: number, patch: Partial<IExceptionSlotPayload>) => {
        onChange(exceptions.map((ex, i) => (i === index ? { ...ex, ...patch } : ex)));
    };

    const addTimeSlot = (index: number) => {
        const ex = exceptions[index];
        update(index, { slots: [...(ex.slots ?? []), { startTime: '', endTime: '' }] });
    };

    const removeTimeSlot = (exIdx: number, tsIdx: number) => {
        const ex = exceptions[exIdx];
        update(exIdx, { slots: (ex.slots ?? []).filter((_, i) => i !== tsIdx) });
    };

    const updateTimeSlot = (
        exIdx: number,
        tsIdx: number,
        field: 'startTime' | 'endTime',
        val: string,
    ) => {
        const ex = exceptions[exIdx];
        const slots = (ex.slots ?? []).map((ts, i) =>
            i === tsIdx ? { ...ts, [field]: val } : ts,
        );
        update(exIdx, { slots });
    };

    return (
        <div className="flex flex-col gap-3">
            {exceptions.length === 0 && (
                <p className="text-sm italic text-[#b0917a]">
                    Chưa có ngày ngoại lệ nào. Thêm ngày đặc biệt như lễ, tết, sự kiện...
                </p>
            )}

            {exceptions.map((ex, i) => (
                <div
                    key={i}
                    className="rounded-xl border border-[#e2ccb0] bg-[#fdf8f4] p-4 shadow-sm"
                >
                    {/* Row 1: date, reason, isClosed, remove */}
                    <div className="mb-3 grid grid-cols-12 items-start gap-3">
                        {/* Date */}
                        <div className="col-span-3 flex flex-col gap-1">
                            <label className="text-[10px] font-semibold uppercase tracking-wide text-[#9a7a5f]">
                                Ngày diễn ra
                            </label>
                            <input
                                type="date"
                                value={typeof ex.date === 'string' ? ex.date.split('T')[0] : ''}
                                onChange={(e) => update(i, { date: e.target.value })}
                                className="rounded-lg border border-[#d4b896] bg-white px-2 py-1.5 text-sm text-[#4a3728] focus:border-[#6f4e37] focus:outline-none"
                            />
                        </div>

                        {/* Reason */}
                        <div className="col-span-5 flex flex-col gap-1">
                            <label className="text-[10px] font-semibold uppercase tracking-wide text-[#9a7a5f]">
                                Lý do
                            </label>
                            <input
                                type="text"
                                placeholder="VD: Ngày lễ, sự kiện..."
                                value={ex.reason ?? ''}
                                onChange={(e) => update(i, { reason: e.target.value })}
                                className="rounded-lg border border-[#d4b896] bg-white px-3 py-1.5 text-sm text-[#4a3728] placeholder-[#c0a585] focus:border-[#6f4e37] focus:outline-none"
                            />
                        </div>

                        {/* isClosed toggle */}
                        <div className="col-span-3 flex flex-col items-start gap-1">
                            <label className="text-[10px] font-semibold uppercase tracking-wide text-[#9a7a5f]">
                                Khung giờ
                            </label>
                            <button
                                type="button"
                                onClick={() => update(i, { isClosed: !ex.isClosed })}
                                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                                    ex.isClosed
                                        ? 'bg-red-100 text-red-700'
                                        : 'border border-[#d4b896] bg-white text-[#6f4e37]'
                                }`}
                            >
                                {ex.isClosed ? 'Đóng cả ngày' : 'Giờ riêng'}
                            </button>
                        </div>

                        {/* Remove */}
                        <div className="col-span-1 flex items-end justify-end pb-1">
                            <button
                                type="button"
                                onClick={() => remove(i)}
                                className="rounded-lg p-1.5 text-red-400 hover:bg-red-50 hover:text-red-600"
                                title="Gỡ bỏ"
                            >
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Time slots (only when not closed) */}
                    {!ex.isClosed && (
                        <div className="flex flex-col gap-2">
                            {(ex.slots ?? []).map((ts, tsIdx) => (
                                <div key={tsIdx} className="flex items-center gap-2">
                                    <input
                                        type="time"
                                        value={ts.startTime}
                                        onChange={(e) =>
                                            updateTimeSlot(i, tsIdx, 'startTime', e.target.value)
                                        }
                                        className="rounded-lg border border-[#d4b896] bg-white px-2 py-1.5 text-sm text-[#4a3728] focus:border-[#6f4e37] focus:outline-none"
                                    />
                                    <span className="text-[#9a7a5f]">–</span>
                                    <input
                                        type="time"
                                        value={ts.endTime}
                                        onChange={(e) =>
                                            updateTimeSlot(i, tsIdx, 'endTime', e.target.value)
                                        }
                                        className="rounded-lg border border-[#d4b896] bg-white px-2 py-1.5 text-sm text-[#4a3728] focus:border-[#6f4e37] focus:outline-none"
                                    />
                                    {(ex.slots ?? []).length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeTimeSlot(i, tsIdx)}
                                            className="text-sm text-red-400 hover:text-red-600"
                                        >
                                            ✕
                                        </button>
                                    )}
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={() => addTimeSlot(i)}
                                className="mt-1 w-fit rounded-lg border border-dashed border-[#c8a882] px-3 py-1 text-xs text-[#9a7a5f] hover:border-[#6f4e37] hover:text-[#6f4e37]"
                            >
                                + Thêm khung giờ
                            </button>
                        </div>
                    )}

                    {/* Detail textarea */}
                    <div className="mt-3">
                        <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-[#9a7a5f]">
                            Mô tả chi tiết
                        </label>
                        <textarea
                            rows={2}
                            placeholder="Nhập lý do chi tiết (VD: Đóng cửa sớm cho Giáng Sinh)..."
                            value={ex.reason ?? ''}
                            onChange={(e) => update(i, { reason: e.target.value })}
                            className="w-full resize-none rounded-lg border border-[#d4b896] bg-white px-3 py-2 text-sm text-[#4a3728] placeholder-[#c0a585] focus:border-[#6f4e37] focus:outline-none"
                        />
                    </div>
                </div>
            ))}

            <button
                type="button"
                onClick={add}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-[#c8a882] py-3 text-sm font-medium text-[#9a7a5f] transition-colors hover:border-[#6f4e37] hover:bg-[#fdf8f4] hover:text-[#6f4e37]"
            >
                <span className="text-lg font-light">+</span>
                Thêm ngoại lệ mới
            </button>
        </div>
    );
}
