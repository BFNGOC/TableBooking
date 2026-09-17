"use client";

import { Button } from "@heroui/react";
import TablePaginationCustom, {
	ColumnTable,
} from "@/shared/components/table/TablePaginationCustom";
import ActionGroup, {
	TableAction,
} from "@/shared/components/table/ActionGroup";
import { useFormModal } from "@/shared/hooks/useFormModal";
import {
	IPricingRule,
	PricingAdjustmentType,
	PricingApplyType,
	PricingValueType,
} from "../types/pricing-rule.type";
import {
	APPLY_TYPE_LABELS,
	RULE_TYPE_LABELS,
} from "../constants/pricing-rule-form-fields";
import {
	useCreatePricingRule,
	usePricingRuleTable,
	useUpdatePricingRule,
} from "../hooks/usePricingRule";
import PricingRuleFilterBar from "../components/PricingRuleFilterBar";
import PricingRuleFormModal from "../components/PricingRuleFormModal";

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatValue(rule: IPricingRule): string {
	const sign =
		rule.adjustmentType === PricingAdjustmentType.INCREASE ? "+" : "-";
	if (rule.valueType === PricingValueType.PERCENT) {
		return `${sign}${rule.value}%`;
	}
	return `${sign}${rule.value.toLocaleString("vi-VN")} VND`;
}

function ApplyTypeBadge({ type }: { type?: PricingApplyType }) {
	if (!type) return null;
	return (
		<span className="text-xs font-semibold">{APPLY_TYPE_LABELS[type]}</span>
	);
}

function StatusBadge({ isActive }: { isActive?: boolean }) {
	return (
		<span className="text-xs font-semibold">
			{isActive ? "Hoạt động" : "Tắt"}
		</span>
	);
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function PricingRulePage() {
	const {
		data,
		pagination,
		filterValues,
		loading,
		handleChangePage,
		handleFilterChange,
		handleFilterSubmit,
		handleFilterReset,
		handleDelete,
		deleting,
	} = usePricingRuleTable();

	const modal = useFormModal<IPricingRule>();
	const createMutation = useCreatePricingRule();
	const updateMutation = useUpdatePricingRule();

	// ── Submit handler ────────────────────────────────────────────────────────
	const handleSubmit = (values: Partial<IPricingRule>) => {
		if (modal.mode === "create") {
			createMutation.mutate(values as any, { onSuccess: modal.close });
		} else if (modal.mode === "edit" && modal.selectedRecord?._id) {
			updateMutation.mutate(
				{ id: modal.selectedRecord._id, body: values as any },
				{ onSuccess: modal.close },
			);
		}
	};

	// ── Columns ───────────────────────────────────────────────────────────────
	const columns: ColumnTable<IPricingRule>[] = [
		{
			id: "index",
			name: "STT",
			render: (_val, _record) => {
				const idx = data.indexOf(_record);
				return (
					<span className="text-sm">
						{(pagination.currentPage - 1) * pagination.pageSize +
							idx +
							1}
					</span>
				);
			},
		},
		{
			id: "name",
			name: "Tên quy tắc",
			render: (val, record) => (
				<div>
					<p className="font-semibold">{val}</p>
					<p className="text-xs">
						{RULE_TYPE_LABELS[record.type]} · Ưu tiên:{" "}
						{record.priority ?? 0}
					</p>
				</div>
			),
		},
		{
			id: "value",
			name: "Giá trị điều chỉnh",
			render: (_val, record) => (
				<span className="font-bold">{formatValue(record)}</span>
			),
		},
		{
			id: "applyType",
			name: "Phạm vi",
			render: (val) => <ApplyTypeBadge type={val} />,
		},
		{
			id: "isActive",
			name: "Trạng thái",
			render: (val) => <StatusBadge isActive={val} />,
		},
		{
			id: "_id",
			name: "Hành động",
			render: (_val, record) => {
				const actions: TableAction<IPricingRule>[] = [
					{
						icon: (
							<svg
								className="h-4 w-4"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
								/>
							</svg>
						),
						tooltip: "Chỉnh sửa",
						onPress: (r) => modal.openEdit(r),
					},
					{
						icon: (
							<svg
								className="h-4 w-4"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
								/>
							</svg>
						),
						tooltip: "Xóa",
						className: "",
						isPending: deleting,
						confirm: {
							title: "Xóa quy tắc giá",
							description: (r) =>
								`Bạn có chắc muốn xóa quy tắc "${r.name}"? Hành động không thể hoàn tác.`,
						},
						onPress: (r) => r._id && handleDelete(r._id),
					},
				];
				return <ActionGroup record={record} actions={actions} />;
			},
		},
	];

	// ── Render ────────────────────────────────────────────────────────────────
	return (
		<div className="flex flex-col gap-4">
			{/* Header */}
			<div className="flex items-start justify-between">
				<div>
					<h1 className="text-xl font-bold text-[#4a3728]">
						Quản lý Quy tắc Giá
					</h1>
					<p className="mt-0.5 text-sm text-gray-500">
						Cấu hình phụ thu, giảm giá theo thời gian, ngày lễ hoặc
						khu vực bàn
					</p>
				</div>
				<Button
					className="bg-[#6f4e37] font-semibold text-white"
					onPress={modal.openCreate}
				>
					+ Tạo quy tắc
				</Button>
			</div>

			{/* Filter */}
			<PricingRuleFilterBar
				filterValues={filterValues}
				onFilterChange={handleFilterChange}
				onFilterSubmit={handleFilterSubmit}
				onFilterReset={handleFilterReset}
			/>

			{/* Table */}
			<TablePaginationCustom<IPricingRule>
				columns={columns}
				data={data}
				pagination={pagination}
				isPending={loading}
				onChangPage={handleChangePage}
			/>

			{/* Modal */}
			<PricingRuleFormModal
				isOpen={modal.open}
				mode={modal.mode}
				values={modal.selectedRecord}
				onValuesChange={modal.setSelectedRecord as any}
				onSubmit={handleSubmit}
				onClose={modal.close}
				isPending={createMutation.isPending || updateMutation.isPending}
			/>
		</div>
	);
}
