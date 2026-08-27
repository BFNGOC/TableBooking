"use client";

import { useState, useEffect } from "react";
import { Button } from "@heroui/react";
import CustomForm from "@/shared/components/form/CustomForm";
import ConfirmModal from "@/shared/components/modals/ConfirmModal";
import { ITable, TableStatus } from "../types/table.type";
import { useUpdateTable, useDeleteTable } from "../hooks/useTableCrud";
import { UpdateTablePayload } from "../types/table-payload";
import { TABLE_DETAIL_FIELDS } from "../constants/table-detail-fields";

interface TableDetailPanelProps {
	table: ITable;
	onClose: () => void;
	onDeleted: () => void;
}

function TableDetailPanel({
	table,
	onClose,
	onDeleted,
}: TableDetailPanelProps) {
	const [formValues, setFormValues] = useState<Partial<ITable>>({});
	const [confirmOpen, setConfirmOpen] = useState(false);

	const updateTable = useUpdateTable();
	const deleteTable = useDeleteTable();

	// Sync khi chọn bàn khác
	useEffect(() => {
		setFormValues({
			tableNumber: table.tableNumber,
			capacity: table.capacity,
			status: table.status,
			basePrice: table.basePrice,
			depositType: table.depositType,
			depositAmount: table.depositAmount,
			description: table.description,
		});
	}, [table._id]);

	const handleSubmit = (values: Partial<ITable>) => {
		if (!table._id) return;
		updateTable.mutate({
			tableId: table._id,
			payload: values as UpdateTablePayload,
		});
	};

	const handleDelete = () => {
		if (!table._id) return;
		deleteTable.mutate(table._id, {
			onSuccess: () => {
				setConfirmOpen(false);
				onDeleted();
			},
		});
	};

	return (
		<div className="flex flex-col gap-4">
			{/* Status badge */}
			<span
				className={`inline-block w-fit rounded-full px-2 py-0.5 text-xs font-medium ${
					table.status === TableStatus.AVAILABLE
						? "bg-green-100 text-green-700"
						: table.status === TableStatus.MAINTENANCE
							? "bg-red-100 text-red-700"
							: "bg-gray-100 text-gray-600"
				}`}
			>
				{table.status === TableStatus.AVAILABLE
					? "Sẵn sàng"
					: table.status === TableStatus.MAINTENANCE
						? "Bảo trì"
						: "Ngưng hoạt động"}
			</span>

			{/* Form */}
			<CustomForm<ITable>
				fields={TABLE_DETAIL_FIELDS}
				values={formValues}
				onValuesChange={setFormValues}
				onSubmit={handleSubmit}
				mode="edit"
				footer={
					<Button
						type="submit"
						className="w-full"
						isPending={updateTable.isPending}
						isDisabled={updateTable.isPending}
					>
						Lưu thay đổi
					</Button>
				}
				footerClassName="col-span-12 flex-col"
			/>

			{/* Delete */}
			<div className="">
				<Button
					variant="outline"
					className="w-full border-red-700 text-red-500 hover:bg-red-50"
					onPress={() => setConfirmOpen(true)}
				>
					Xóa bàn
				</Button>
			</div>

			<ConfirmModal
				isOpen={confirmOpen}
				onClose={() => setConfirmOpen(false)}
				onConfirm={handleDelete}
				title="Xóa bàn"
				description={`Bạn có chắc muốn xóa bàn ${table.tableNumber}? Hành động này không thể hoàn tác.`}
				isLoading={deleteTable.isPending}
			/>
		</div>
	);
}

export default TableDetailPanel;
