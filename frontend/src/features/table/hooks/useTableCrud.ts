import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { tableApi } from "../api/table-api";
import { tableQueryKeys } from "../constants/query-key";
import { useToast } from "@/shared/hooks/useToast";
import {
	CreateTablePayload,
	FindTablesParams,
	UpdateTablePayload,
	UpdateTablePositionPayload,
} from "../types/table-payload";

export function useGetTables(params: FindTablesParams) {
	return useQuery({
		queryKey: tableQueryKeys.GET_TABLES(params.areaId),
		queryFn: () => tableApi.getAll(params),
		enabled: Boolean(params.areaId),
	});
}

export function useGetTable(tableId?: string) {
	return useQuery({
		queryKey: tableQueryKeys.GET_TABLE(tableId!),
		queryFn: () => tableApi.getOne(tableId!),
		enabled: Boolean(tableId),
	});
}

export function useCreateTable() {
	const queryClient = useQueryClient();
	const { showToast } = useToast();

	return useMutation({
		mutationFn: (payload: CreateTablePayload) => tableApi.create(payload),

		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: tableQueryKeys.ALL,
			});

			showToast("success", "Tạo bàn thành công", "Bàn đã được tạo.");
		},

		onError: (error: any) => {
			showToast(
				"error",
				"Tạo bàn thất bại",
				error?.response?.data?.message ??
					error?.message ??
					"Đã có lỗi xảy ra",
			);
		},
	});
}

export function useUpdateTable() {
	const queryClient = useQueryClient();
	const { showToast } = useToast();

	return useMutation({
		mutationFn: ({
			tableId,
			payload,
		}: {
			tableId: string;
			payload: UpdateTablePayload;
		}) => tableApi.update(tableId, payload),

		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: tableQueryKeys.ALL,
			});

			showToast(
				"success",
				"Cập nhật bàn thành công",
				"Thông tin bàn đã được cập nhật.",
			);
		},

		onError: (error: any) => {
			showToast(
				"error",
				"Cập nhật bàn thất bại",
				error?.response?.data?.message ??
					error?.message ??
					"Đã có lỗi xảy ra",
			);
		},
	});
}

export function useUpdateTablePosition() {
	const queryClient = useQueryClient();
	const { showToast } = useToast();

	return useMutation({
		mutationFn: ({
			tableId,
			payload,
		}: {
			tableId: string;
			payload: UpdateTablePositionPayload;
		}) => tableApi.updatePosition(tableId, payload),

		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: tableQueryKeys.ALL,
			});

			showToast(
				"success",
				"Cập nhật vị trí bàn thành công",
				"Vị trí bàn đã được cập nhật.",
			);
		},

		onError: (error: any) => {
			showToast(
				"error",
				"Cập nhật vị trí bàn thất bại",
				error?.response?.data?.message ??
					error?.message ??
					"Đã có lỗi xảy ra",
			);
		},
	});
}

export function useDeleteTable() {
	const queryClient = useQueryClient();
	const { showToast } = useToast();

	return useMutation({
		mutationFn: (tableId: string) => tableApi.remove(tableId),

		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: tableQueryKeys.ALL,
			});

			showToast("success", "Xóa bàn thành công", "Bàn đã được xóa.");
		},

		onError: (error: any) => {
			showToast(
				"error",
				"Xóa bàn thất bại",
				error?.response?.data?.message ??
					error?.message ??
					"Đã có lỗi xảy ra",
			);
		},
	});
}
