"use client";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@heroui/react";
import ConfirmModal from "@/shared/components/modals/ConfirmModal";
import WeeklySlotsEditor from "./WeeklySlotsEditor";
import ExceptionSlotsEditor from "./ExceptionSlotsEditor";
import {
	ITableAvailability,
	IWeeklySlotPayload,
	IExceptionSlotPayload,
} from "../types/table-availability.type";
import { ITable } from "@/features/table/types/table.type";
import {
	useCreateTableAvailability,
	useUpdateTableAvailability,
	useDeleteTableAvailability,
} from "../hooks/useTableAvailabilityCrud";

// Hook trả về ITable được enrich thêm areaName từ useGetAllTablesForRestaurant
type ITableWithArea = ITable & { areaName?: string };

interface AvailabilityConfigPanelProps {
	/** null = tạo mới */
	schedule: ITableAvailability | null;
	allTables: ITable[];
	/** Danh sách TẤT CẢ schedules hiện có — dùng để tính bàn đã bị dùng */
	allSchedules: ITableAvailability[];
	onSaved: (saved: ITableAvailability) => void;
	onDeleted: () => void;
	scheduleIndex?: number;
}

const DEFAULT_WEEKLY: IWeeklySlotPayload[] = [1, 2, 3, 4, 5].map((d) => ({
	dayOfWeek: d,
	isActive: true,
	slots: [{ startTime: "08:00", endTime: "22:00" }],
}));

export default function AvailabilityConfigPanel({
	schedule,
	allTables,
	allSchedules,
	onSaved,
	onDeleted,
	scheduleIndex,
}: AvailabilityConfigPanelProps) {
	const isNew = !schedule?._id;

	const [selectedTableIds, setSelectedTableIds] = useState<string[]>([]);
	const [weeklySlots, setWeeklySlots] =
		useState<IWeeklySlotPayload[]>(DEFAULT_WEEKLY);
	const [exceptions, setExceptions] = useState<IExceptionSlotPayload[]>([]);
	const [confirmOpen, setConfirmOpen] = useState(false);
	const [activeAreaId, setActiveAreaId] = useState<string | undefined>(undefined);

	const createMutation = useCreateTableAvailability();
	const updateMutation = useUpdateTableAvailability();
	const deleteMutation = useDeleteTableAvailability();

	// ─── Sync khi chọn schedule khác ─────────────────────────────────────────
	useEffect(() => {
		if (schedule) {
			setSelectedTableIds(schedule.tableIds ?? []);
			setWeeklySlots(
				(schedule.weeklySlots ?? []).map((s) => ({
					dayOfWeek: s.dayOfWeek,
					isActive: s.isActive ?? true,
					slots:
						s.slots?.map((ts) => ({
							startTime: ts.startTime,
							endTime: ts.endTime,
						})) ?? [],
				})),
			);
			setExceptions(
				(schedule.exceptions ?? []).map((ex) => ({
					date:
						typeof ex.date === "string"
							? ex.date.split("T")[0]
							: new Date(ex.date).toISOString().split("T")[0],
					reason: ex.reason ?? "",
					isClosed: ex.isClosed ?? false,
					slots:
						ex.slots?.map((ts) => ({
							startTime: ts.startTime,
							endTime: ts.endTime,
						})) ?? [],
				})),
			);
		} else {
			setSelectedTableIds([]);
			setWeeklySlots(DEFAULT_WEEKLY);
			setExceptions([]);
		}
	}, [schedule?._id]);

	// ─── Tính bàn đã bị dùng bởi schedule khác ───────────────────────────────
	const takenTableIds = useMemo(() => {
		return new Set(
			allSchedules
				.filter((s) => s._id !== schedule?._id) // loại trừ schedule đang edit
				.flatMap((s) => s.tableIds ?? []),
		);
	}, [allSchedules, schedule?._id]);

	// ─── Nhóm bàn theo khu vực ────────────────────────────────────────────────
	const areaGroups = useMemo(() => {
		const tables = allTables as ITableWithArea[];
		const groups: Record<string, { areaName: string; tables: ITableWithArea[] }> = {};

		for (const table of tables) {
			const key = table.areaId ?? "__no_area__";
			if (!groups[key]) {
				groups[key] = {
					areaName: table.areaName ?? "Khu vực khác",
					tables: [],
				};
			}
			groups[key].tables.push(table);
		}

		return groups;
	}, [allTables]);

	// Danh sách areaId theo thứ tự ổn định
	const orderedAreaIds = useMemo(() => Object.keys(areaGroups), [areaGroups]);

	// Auto-chọn tab đầu tiên
	const resolvedAreaId = activeAreaId ?? orderedAreaIds[0];
	const activeGroup = resolvedAreaId ? areaGroups[resolvedAreaId] : undefined;

	// ─── Handlers ────────────────────────────────────────────────────────────
	const toggleTable = (tableId: string) => {
		setSelectedTableIds((prev) =>
			prev.includes(tableId)
				? prev.filter((id) => id !== tableId)
				: [...prev, tableId],
		);
	};

	const toggleAreaAll = (areaId: string) => {
		const group = areaGroups[areaId];
		if (!group) return;

		const eligible = group.tables
			.filter((t) => t._id && !takenTableIds.has(t._id))
			.map((t) => t._id!);

		const allSelected = eligible.every((id) => selectedTableIds.includes(id));

		if (allSelected) {
			setSelectedTableIds((prev) => prev.filter((id) => !eligible.includes(id)));
		} else {
			setSelectedTableIds((prev) => [...new Set([...prev, ...eligible])]);
		}
	};

	const handleSave = () => {
		if (selectedTableIds.length === 0) return;

		const payload = {
			tableIds: selectedTableIds,
			weeklySlots: weeklySlots.filter(
				(s) => s.isActive !== false && s.slots.length > 0,
			),
			exceptions: exceptions.map((ex) => ({
				...ex,
				date: new Date(ex.date).toISOString(),
			})),
		};

		if (isNew) {
			createMutation.mutate(payload, {
				onSuccess: (data) => onSaved(data),
			});
		} else {
			updateMutation.mutate(
				{ id: schedule!._id!, payload },
				{ onSuccess: (data) => onSaved(data) },
			);
		}
	};

	const handleDelete = () => {
		deleteMutation.mutate(schedule!._id!, {
			onSuccess: () => {
				setConfirmOpen(false);
				onDeleted();
			},
		});
	};

	const isPending = createMutation.isPending || updateMutation.isPending;

	return (
		<div className="flex h-full flex-col overflow-y-auto">
			{/* ── Header ── */}
			<div className="sticky top-0 z-10 flex items-start justify-between border-b border-[#e2ccb0] bg-white px-6 py-4">
				<div>
					<div className="flex items-center gap-2">
						<span className="text-sm font-bold text-[#c8a882]">
							#{String(scheduleIndex ?? 0).padStart(2, "0")}
						</span>
						<h2 className="text-lg font-bold text-[#4a3728]">
							{isNew
								? "Tạo lịch mới"
								: `Cấu hình Lịch #${String(scheduleIndex ?? 0).padStart(2, "00")}`}
						</h2>
					</div>
					<p className="mt-0.5 text-xs text-[#9a7a5f]">
						Chỉnh sửa khung giờ và ngoại lệ cho các bàn đã chọn
					</p>
				</div>
				<div className="flex items-center gap-2">
					{!isNew && (
						<button
							type="button"
							onClick={() => setConfirmOpen(true)}
							className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-500 hover:bg-red-50"
						>
							Xóa lịch
						</button>
					)}
					<div className="rounded-lg bg-[#e8f5e9] px-3 py-1.5 text-xs font-semibold text-[#388e3c]">
						Áp dụng cho các bàn đã chọn
					</div>
				</div>
			</div>

			<div className="flex flex-col gap-6 p-6">
				{/* ── Section 1: Bàn áp dụng ── */}
				<section>
					<SectionHeader
						icon="🪑"
						title="Bàn áp dụng"
						subtitle="Applied Tables"
						extra={
							selectedTableIds.length > 0 ? (
								<span className="rounded-full bg-[#6f4e37] px-2.5 py-0.5 text-[11px] font-bold text-white">
									{selectedTableIds.length} đã chọn
								</span>
							) : undefined
						}
					/>

					{allTables.length === 0 ? (
						<p className="text-sm italic text-[#b0917a]">
							Chưa có bàn nào. Hãy tạo bàn trước.
						</p>
					) : (
						<div className="flex flex-col gap-3">
							{/* Area tabs */}
							<div className="flex flex-wrap items-center gap-2">
								{orderedAreaIds.map((areaId) => {
									const g = areaGroups[areaId];
									const selCount = g.tables.filter((t) => selectedTableIds.includes(t._id ?? '')).length;
									return (
										<button
											key={areaId}
											type="button"
											onClick={() => setActiveAreaId(areaId)}
											className={`flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors ${
												resolvedAreaId === areaId
													? 'border-[#6f4e37] bg-[#6f4e37] text-white'
													: 'border-slate-300 bg-white text-slate-600 hover:border-[#6f4e37] hover:text-[#6f4e37]'
											}`}
										>
											{g.areaName}
										</button>
									);
								})}
							</div>

							{/* Tables of active area */}
							{activeGroup && (() => {
								const eligibleInArea = activeGroup.tables.filter((t) => t._id && !takenTableIds.has(t._id));
								const allAreaSelected = eligibleInArea.length > 0 && eligibleInArea.every((t) => selectedTableIds.includes(t._id!));
								return (
									<div>
										{eligibleInArea.length > 0 && (
											<div className="mb-2 flex justify-end">
												<button type="button" onClick={() => resolvedAreaId && toggleAreaAll(resolvedAreaId)}
													className="text-[10px] font-medium text-[#9a7a5f] hover:text-[#6f4e37]">
													{allAreaSelected ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
												</button>
											</div>
										)}
										<div className="flex flex-wrap gap-2">
											{activeGroup.tables.map((table) => {
												const selected = selectedTableIds.includes(table._id ?? '');
												const isTaken = isNew && takenTableIds.has(table._id ?? '');
												return (
													<button key={table._id} type="button"
														onClick={() => !isTaken && toggleTable(table._id!)}
														disabled={isTaken}
														title={isTaken ? 'Bàn này đã được gán vào lịch khác' : undefined}
														className={[
															'flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition-all',
															isTaken ? 'cursor-not-allowed border-[#e8d9c8] bg-[#f5efeb] text-[#c8a882] opacity-60'
																: selected ? 'border-[#6f4e37] bg-[#6f4e37] text-white shadow-sm'
																: 'border-[#d4b896] bg-white text-[#4a3728] hover:border-[#6f4e37]',
														].join(' ')}
													>
														{selected && !isTaken && <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>}
														{isTaken && <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>}
														{table.tableNumber || `Bàn ${table._id?.slice(-4)}`}
													</button>
												);
											})}
										</div>
									</div>
								);
							})()}
						</div>
					)}

					{/* Taken table note */}
					{isNew && takenTableIds.size > 0 && (
						<p className="mt-3 flex items-center gap-1.5 text-xs text-[#b0917a]">
							<svg className="h-3.5 w-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
							</svg>
							Bàn bị khoá đã được gán vào lịch khác. Chỉnh sửa lịch đó để thay đổi.
						</p>
					)}
				</section>

				{/* ── Section 2: Weekly Slots ── */}
				<section>
					<SectionHeader
						icon="📅"
						title="Khung giờ hàng tuần"
						subtitle="Weekly Slots"
						badge={`${weeklySlots.filter((s) => s.isActive !== false).length} ngày`}
					/>
					<WeeklySlotsEditor
						slots={weeklySlots}
						onChange={setWeeklySlots}
					/>
				</section>

				{/* ── Section 3: Exceptions ── */}
				<section>
					<SectionHeader
						icon="🗓️"
						title="Ngoại lệ"
						subtitle="Exceptions"
						badge={
							exceptions.length > 0
								? `${exceptions.length} ngày`
								: undefined
						}
					/>
					<ExceptionSlotsEditor
						exceptions={exceptions}
						onChange={setExceptions}
					/>
				</section>

				{/* ── Footer: Save button ── */}
				<div className="flex gap-3 border-t border-[#e2ccb0] pt-4">
					<Button
						onPress={handleSave}
						isPending={isPending}
						isDisabled={isPending || selectedTableIds.length === 0}
						className="flex-1 bg-[#6f4e37] font-semibold text-white hover:bg-[#5a3e2b]"
					>
						{isNew ? "Tạo lịch" : "Lưu thay đổi"}
					</Button>
				</div>
			</div>

			{/* Delete confirm */}
			<ConfirmModal
				isOpen={confirmOpen}
				onClose={() => setConfirmOpen(false)}
				onConfirm={handleDelete}
				title="Xóa lịch khung giờ"
				description="Bạn có chắc muốn xóa lịch này? Hành động không thể hoàn tác."
				isLoading={deleteMutation.isPending}
			/>
		</div>
	);
}

// ── Sub-component ─────────────────────────────────────────────────────────────

function SectionHeader({
	icon,
	title,
	subtitle,
	badge,
	extra,
}: {
	icon: string;
	title: string;
	subtitle: string;
	badge?: string;
	extra?: React.ReactNode;
}) {
	return (
		<div className="mb-3 flex items-center gap-2">
			<span className="text-base">{icon}</span>
			<div className="flex-1">
				<div className="flex items-center gap-2">
					<h3 className="text-sm font-bold text-[#4a3728]">
						{title}
					</h3>
					{badge && (
						<span className="rounded-full bg-[#f3e5d8] px-2 py-0.5 text-[10px] font-semibold text-[#6f4e37]">
							{badge}
						</span>
					)}
					{extra}
				</div>
				<p className="text-[10px] text-[#9a7a5f]">{subtitle}</p>
			</div>
			<div className="h-px flex-1 bg-[#e2ccb0]" />
		</div>
	);
}
