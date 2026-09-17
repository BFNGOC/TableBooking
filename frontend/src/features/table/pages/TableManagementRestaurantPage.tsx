"use client";

import { useState } from "react";
import { Button } from "@heroui/react";
import { useFormModal } from "@/shared/hooks/useFormModal";
import { useRestaurantMe } from "@/features/restaurant/hooks/useRestaurantMe";
import {
	useGetAreas,
	useCreateArea,
	useUpdateArea,
	useDeleteArea,
} from "@/features/area/hooks/useAreaCrud";
import {
	useGetTables,
	useCreateTable,
	useBulkUpdatePositions,
} from "../hooks/useTableCrud";
import { IArea } from "@/features/area/types/area.type";
import { ITable } from "../types/table.type";
import TableCanvasArea from "../components/TableCanvasArea";
import TableDetailPanel from "../components/TableDetailPanel";
import AreaFormModal from "@/features/area/components/AreaFormModal";
import ConfirmModal from "@/shared/components/modals/ConfirmModal";
import DrawerCustom from "@/shared/components/drawer/DrawerCustom";

/** Bán kính bàn (px) – phải khớp với TABLE_RADIUS trong TableCanvasArea */
const TABLE_RADIUS = 40;
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 560;
const GRID_STEP = TABLE_RADIUS * 2 + 20; // khoảng cách giữa tâm 2 bàn

/**
 * Tìm vị trí trống đầu tiên (theo lưới) không đè lên bàn đã tồn tại.
 */
function findEmptyPosition(existingTables: ITable[]): { x: number; y: number } {
	const padding = TABLE_RADIUS + 10;
	for (let row = 0; ; row++) {
		for (
			let col = 0;
			col < Math.floor((CANVAS_WIDTH - padding * 2) / GRID_STEP) + 1;
			col++
		) {
			const x = padding + col * GRID_STEP;
			const y = padding + row * GRID_STEP;
			if (y + TABLE_RADIUS > CANVAS_HEIGHT) break;
			const overlap = existingTables.some((t) => {
				const dx = (t.x ?? 80) - x;
				const dy = (t.y ?? 80) - y;
				return Math.sqrt(dx * dx + dy * dy) < TABLE_RADIUS * 2 + 4;
			});
			if (!overlap) return { x, y };
		}
		// nếu hàng vượt canvas, đặt cuối canvas
		if (padding + row * GRID_STEP + TABLE_RADIUS > CANVAS_HEIGHT) {
			return { x: padding, y: padding };
		}
	}
}

function TableManagementPage() {
	const { data: restaurant, isLoading: restaurantLoading } =
		useRestaurantMe();
	const restaurantId = restaurant?._id as string | undefined;

	// Area state
	const [activeAreaId, setActiveAreaId] = useState<string | undefined>(
		undefined,
	);
	const [deleteAreaTarget, setDeleteAreaTarget] = useState<IArea | null>(
		null,
	);
	const [doubleClickAreaId, setDoubleClickAreaId] = useState<string | null>(
		null,
	);

	// Table state
	const [selectedTable, setSelectedTable] = useState<ITable | null>(null);
	const [editMode, setEditMode] = useState(false);
	/** Các vị trí bàn đã thay đổi trong phiên edit, chưa được lưu vào server */
	const [pendingPositions, setPendingPositions] = useState<
		Record<string, { x: number; y: number }>
	>({});

	// Area form modal
	const areaModal = useFormModal<IArea>();

	// Queries
	const { data: areas = [], isLoading: areasLoading } = useGetAreas({
		restaurantId: restaurantId ?? "",
	});

	// Set first area as default when loaded
	const resolvedAreaId =
		activeAreaId ?? (areas.length > 0 ? areas[0]._id : undefined);

	const { data: tables = [], isLoading: tablesLoading } = useGetTables({
		areaId: resolvedAreaId ?? "",
	});

	// Mutations
	const createArea = useCreateArea();
	const updateArea = useUpdateArea();
	const deleteArea = useDeleteArea();
	const createTable = useCreateTable();
	const bulkUpdatePositions = useBulkUpdatePositions();

	// ─── Area handlers ───────────────────────────────────────────────
	const handleAreaSubmit = (values: Partial<IArea>) => {
		if (areaModal.mode === "create") {
			createArea.mutate({ ...values, restaurantId } as any, {
				onSuccess: areaModal.close,
			});
		} else if (areaModal.mode === "edit" && areaModal.selectedRecord?._id) {
			updateArea.mutate(
				{ areaId: areaModal.selectedRecord._id, payload: values },
				{ onSuccess: areaModal.close },
			);
		}
	};

	const handleDeleteArea = () => {
		if (!deleteAreaTarget?._id) return;
		deleteArea.mutate(deleteAreaTarget._id, {
			onSuccess: () => {
				setDeleteAreaTarget(null);
				if (activeAreaId === deleteAreaTarget._id) {
					setActiveAreaId(undefined);
				}
			},
		});
	};

	// ─── Table handlers ───────────────────────────────────────────────
	const handleAddTable = () => {
		if (!resolvedAreaId) return;
		const { x, y } = findEmptyPosition(tables);
		createTable.mutate(
			{ areaId: resolvedAreaId, capacity: 2, x, y },
			{
				onSuccess: (newTable) => {
					setSelectedTable(newTable);
				},
			},
		);
	};

	/** Chỉ cập nhật local state, chưa gọi API */
	const handlePositionChange = (tableId: string, x: number, y: number) => {
		setPendingPositions((prev) => ({ ...prev, [tableId]: { x, y } }));
	};

	/** Gọi API bulk-update khi user tắt edit mode */
	const handleToggleEditMode = () => {
		if (editMode && Object.keys(pendingPositions).length > 0) {
			// 1 request duy nhất thay vì N request
			bulkUpdatePositions.mutate({
				positions: Object.entries(pendingPositions).map(
					([tableId, { x, y }]) => ({ tableId, x, y }),
				),
			});
			setPendingPositions({});
		}
		setEditMode((v) => !v);
	};

	// ─── Render ───────────────────────────────────────────────────────
	if (restaurantLoading) {
		return (
			<div className="flex h-64 items-center justify-center text-slate-400">
				Đang tải thông tin nhà hàng...
			</div>
		);
	}

	if (!restaurantId) {
		return (
			<div className="flex h-64 items-center justify-center text-slate-400">
				Không tìm thấy thông tin nhà hàng.
			</div>
		);
	}

	return (
		<div className="flex h-full flex-col gap-4">
			{/* ── Toolbar ── */}
			<div className="flex flex-wrap items-center justify-between gap-3">
				{/* Area tabs */}
				<div className="flex flex-wrap items-center gap-2">
					{areasLoading ? (
						// Skeleton cho area tabs
						<div className="flex items-center gap-2">
							<div className="h-9 w-24 animate-pulse rounded-full bg-slate-200" />
							<div className="h-9 w-28 animate-pulse rounded-full bg-slate-200" />
							<div className="h-9 w-20 animate-pulse rounded-full bg-slate-200" />
						</div>
					) : (
						<>
							{areas.map((area) => (
								<button
									key={area._id}
									onClick={() => {
										setActiveAreaId(area._id);
										setSelectedTable(null);
									}}
									onDoubleClick={() => {
										setDoubleClickAreaId(area._id ?? null);
										areaModal.openEdit(area);
									}}
									className={`rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors ${
										resolvedAreaId === area._id
											? "border-[#6f4e37] bg-[#6f4e37] text-white"
											: "border-slate-300 bg-white text-slate-600 hover:border-[#6f4e37] hover:text-[#6f4e37]"
									}`}
									title="Click để chọn · Double click để chỉnh sửa"
								>
									{area.name}
								</button>
							))}
							{/* Xóa area button */}
							{resolvedAreaId && areas.length > 0 && (
								<button
									onClick={() => {
										const area = areas.find(
											(a) => a._id === resolvedAreaId,
										);
										if (area) setDeleteAreaTarget(area);
									}}
									className="rounded-full border border-red-200 px-3 py-1.5 text-sm text-red-400 hover:bg-red-50"
									title="Xóa khu vực này"
								>
									✕
								</button>
							)}
							{/* Thêm area */}
							<button
								onClick={() => areaModal.openCreate()}
								className="rounded-full border border-dashed border-slate-300 px-4 py-1.5 text-sm text-slate-500 hover:border-[#6f4e37] hover:text-[#6f4e37]"
							>
								+ Khu vực
							</button>
						</>
					)}
				</div>

				{/* Action buttons */}
				<div className="flex items-center gap-2">
					<Button
						variant={editMode ? "danger-soft" : "outline"}
						onPress={handleToggleEditMode}
						isPending={bulkUpdatePositions.isPending}
					>
						{editMode
							? Object.keys(pendingPositions).length > 0
								? `Lưu ${Object.keys(pendingPositions).length} bàn`
								: "Xong"
							: "Chỉnh sửa layout"}
					</Button>
					<Button
						onPress={handleAddTable}
						isPending={createTable.isPending}
						isDisabled={!resolvedAreaId || createTable.isPending}
					>
						+ Thêm bàn mới
					</Button>
				</div>
			</div>

			{/* ── Main content ── */}
			{/* ── Main content: canvas full width ── */}
			<div className="min-w-0 flex-1 overflow-auto">
				{areasLoading || tablesLoading ? (
					// Skeleton canvas
					<div className="h-[560px] w-full animate-pulse overflow-hidden rounded-2xl border border-slate-200 bg-[#fafaf8]">
						<div className="flex h-full flex-wrap content-start gap-6 p-10">
							{Array.from({ length: 6 }).map((_, i) => (
								<div
									key={i}
									className="rounded-full bg-slate-200"
									style={{ width: 80, height: 80 }}
								/>
							))}
						</div>
					</div>
				) : !resolvedAreaId ? (
					<div className="flex h-64 items-center justify-center text-slate-400">
						Chưa có khu vực nào. Hãy thêm khu vực mới.
					</div>
				) : (
					<TableCanvasArea
						tables={tables}
						selectedTableId={selectedTable?._id}
						editMode={editMode}
						onSelectTable={setSelectedTable}
						onPositionChange={handlePositionChange}
					/>
				)}
			</div>

			{/* ── Modals ── */}
			<AreaFormModal
				isOpen={areaModal.open}
				mode={areaModal.mode}
				values={areaModal.selectedRecord}
				onValuesChange={(v) =>
					areaModal.setSelectedRecord(
						(prev) => ({ ...prev, ...v }) as IArea,
					)
				}
				onClose={areaModal.close}
				onSubmit={handleAreaSubmit}
				isPending={createArea.isPending || updateArea.isPending}
			/>

			<ConfirmModal
				isOpen={!!deleteAreaTarget}
				onClose={() => setDeleteAreaTarget(null)}
				onConfirm={handleDeleteArea}
				title="Xóa khu vực"
				description={`Bạn có chắc muốn xóa khu vực "${deleteAreaTarget?.name}"? Tất cả bàn trong khu vực này cũng sẽ bị xóa.`}
				isLoading={deleteArea.isPending}
			/>

			{/* ── Drawer chi tiết bàn ── */}
			<DrawerCustom
				isOpen={!!selectedTable}
				onClose={() => setSelectedTable(null)}
				title={selectedTable ? `Bàn ${selectedTable.tableNumber}` : ""}
			>
				{selectedTable && (
					<TableDetailPanel
						key={selectedTable._id}
						table={selectedTable}
						onClose={() => setSelectedTable(null)}
						onDeleted={() => setSelectedTable(null)}
					/>
				)}
			</DrawerCustom>
		</div>
	);
}

export default TableManagementPage;
