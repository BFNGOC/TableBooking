import { useMutation, useQuery, useQueryClient, useQueries } from '@tanstack/react-query';
import { tableAvailabilityApi } from '../api/table-availability-api';
import { tableAvailabilityQueryKeys } from '../constants/query-key';
import { useToast } from '@/shared/hooks/useToast';
import {
    CreateTableAvailabilityPayload,
    UpdateTableAvailabilityPayload,
} from '../types/table-availability.type';
import { useGetAreas } from '@/features/area/hooks/useAreaCrud';
import { tableApi } from '@/features/table/api/table-api';
import { tableQueryKeys } from '@/features/table/constants/query-key';
import { ITable } from '@/features/table/types/table.type';

/** Lấy tất cả availability schedules của restaurant đang đăng nhập */
export function useGetMyAvailabilities() {
    return useQuery({
        queryKey: tableAvailabilityQueryKeys.MY,
        queryFn: () => tableAvailabilityApi.getMy(),
    });
}

/** Lấy chi tiết 1 availability schedule */
export function useGetAvailability(id?: string) {
    return useQuery({
        queryKey: tableAvailabilityQueryKeys.DETAIL(id!),
        queryFn: () => tableAvailabilityApi.getOne(id!),
        enabled: Boolean(id),
    });
}

/** Tạo mới availability schedule */
export function useCreateTableAvailability() {
    const queryClient = useQueryClient();
    const { showToast } = useToast();

    return useMutation({
        mutationFn: (payload: CreateTableAvailabilityPayload) =>
            tableAvailabilityApi.create(payload),

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: tableAvailabilityQueryKeys.ALL });
            showToast('success', 'Tạo lịch thành công', 'Lịch khung giờ đã được tạo.');
        },
        onError: (error: any) => {
            showToast(
                'error',
                'Tạo lịch thất bại',
                error?.response?.data?.message ?? error?.message ?? 'Đã có lỗi xảy ra',
            );
        },
    });
}

/** Cập nhật availability schedule */
export function useUpdateTableAvailability() {
    const queryClient = useQueryClient();
    const { showToast } = useToast();

    return useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: UpdateTableAvailabilityPayload }) =>
            tableAvailabilityApi.update(id, payload),

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: tableAvailabilityQueryKeys.ALL });
            showToast('success', 'Cập nhật thành công', 'Lịch khung giờ đã được cập nhật.');
        },
        onError: (error: any) => {
            showToast(
                'error',
                'Cập nhật thất bại',
                error?.response?.data?.message ?? error?.message ?? 'Đã có lỗi xảy ra',
            );
        },
    });
}

/** Xóa availability schedule */
export function useDeleteTableAvailability() {
    const queryClient = useQueryClient();
    const { showToast } = useToast();

    return useMutation({
        mutationFn: (id: string) => tableAvailabilityApi.remove(id),

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: tableAvailabilityQueryKeys.ALL });
            showToast('success', 'Xóa thành công', 'Lịch khung giờ đã được xóa.');
        },
        onError: (error: any) => {
            showToast(
                'error',
                'Xóa thất bại',
                error?.response?.data?.message ?? error?.message ?? 'Đã có lỗi xảy ra',
            );
        },
    });
}

/**
 * Lấy toàn bộ bàn của restaurant bằng cách fetch song song theo từng area.
 * Cần thiết vì tableApi.getAll() yêu cầu areaId.
 */
export function useGetAllTablesForRestaurant(restaurantId?: string): {
    tables: ITable[];
    isLoading: boolean;
} {
    const { data: areas = [], isLoading: areasLoading } = useGetAreas({
        restaurantId: restaurantId ?? '',
    });

    const tableQueries = useQueries({
        queries: areas.map((area) => ({
            queryKey: tableQueryKeys.GET_TABLES(area._id!),
            queryFn: () => tableApi.getAll({ areaId: area._id! }),
            enabled: Boolean(area._id),
        })),
    });

    const isLoading = areasLoading || tableQueries.some((q) => q.isLoading);
    const tables: ITable[] = tableQueries
        .flatMap((q) => q.data ?? [])
        .map((t) => ({
            ...t,
            areaName: areas.find((a) => a._id === t.areaId)?.name,
        } as ITable & { areaName?: string }));

    return { tables, isLoading };
}
