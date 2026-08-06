import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { areaApi } from "../api/area-api";
import { areaQueryKeys } from "../constants/query-key";
import { useToast } from "@/shared/hooks/useToast";
import {
	CreateAreaPayload,
	FindAreasParams,
	UpdateAreaPayload,
} from "../types/area-payload";

export function useGetAreas(params: FindAreasParams) {
	return useQuery({
		queryKey: areaQueryKeys.GET_AREAS(params.restaurantId),
		queryFn: () => areaApi.getAll(params),
		enabled: Boolean(params.restaurantId),
	});
}

export function useGetArea(areaId?: string) {
	return useQuery({
		queryKey: areaQueryKeys.GET_AREA(areaId!),
		queryFn: () => areaApi.getOne(areaId!),
		enabled: Boolean(areaId),
	});
}

export function useCreateArea() {
	const queryClient = useQueryClient();
	const { showToast } = useToast();

	return useMutation({
		mutationFn: (payload: CreateAreaPayload) => areaApi.create(payload),

		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: areaQueryKeys.ALL,
			});

			showToast(
				"success",
				"Tạo khu vực thành công",
				"Khu vực đã được tạo.",
			);
		},

		onError: (error: any) => {
			showToast(
				"error",
				"Tạo khu vực thất bại",
				error?.response?.data?.message ??
					error?.message ??
					"Đã có lỗi xảy ra",
			);
		},
	});
}

export function useUpdateArea() {
	const queryClient = useQueryClient();
	const { showToast } = useToast();

	return useMutation({
		mutationFn: ({
			areaId,
			payload,
		}: {
			areaId: string;
			payload: UpdateAreaPayload;
		}) => areaApi.update(areaId, payload),

		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: areaQueryKeys.ALL,
			});

			showToast(
				"success",
				"Cập nhật khu vực thành công",
				"Thông tin khu vực đã được cập nhật.",
			);
		},

		onError: (error: any) => {
			showToast(
				"error",
				"Cập nhật khu vực thất bại",
				error?.response?.data?.message ??
					error?.message ??
					"Đã có lỗi xảy ra",
			);
		},
	});
}

export function useDeleteArea() {
	const queryClient = useQueryClient();
	const { showToast } = useToast();

	return useMutation({
		mutationFn: (areaId: string) => areaApi.remove(areaId),

		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: areaQueryKeys.ALL,
			});

			showToast(
				"success",
				"Xóa khu vực thành công",
				"Khu vực đã được xóa.",
			);
		},

		onError: (error: any) => {
			showToast(
				"error",
				"Xóa khu vực thất bại",
				error?.response?.data?.message ??
					error?.message ??
					"Đã có lỗi xảy ra",
			);
		},
	});
}
