import useTable from '@/shared/hooks/useTable';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/shared/hooks/useToast';
import { useRestaurantMe } from '@/features/restaurant/hooks/useRestaurantMe';
import { useGetAreas } from '@/features/area/hooks/useAreaCrud';
import { useGetAllTablesForRestaurant } from '@/features/table-availabilities/hooks/useTableAvailabilityCrud';
import { pricingRuleApi } from '../api/pricing-rule-api';
import { pricingRuleQueryKeys } from '../constants/query-key';
import { IPricingRule } from '../types/pricing-rule.type';
import {
    CreatePricingRulePayload,
    FindPricingRulesParams,
    UpdatePricingRulePayload,
} from '../types/pricing-rule.dto';

// ── Table hook ────────────────────────────────────────────────────────────────

export function usePricingRuleTable() {
    return useTable<IPricingRule, FindPricingRulesParams>({
        queryKey: pricingRuleQueryKeys.ALL,
        fetchApi: (params) => pricingRuleApi.getAll(params),
        removeApi: (id) => pricingRuleApi.remove(id),
    });
}

// ── Create ────────────────────────────────────────────────────────────────────

export function useCreatePricingRule() {
    const queryClient = useQueryClient();
    const { showToast } = useToast();

    return useMutation({
        mutationFn: (payload: CreatePricingRulePayload) =>
            pricingRuleApi.create(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: pricingRuleQueryKeys.ALL });
            showToast('success', 'Thành công', 'Tạo quy tắc giá thành công');
        },
        onError: (error: any) => {
            showToast(
                'error',
                'Thất bại',
                error?.response?.data?.message ?? 'Đã có lỗi xảy ra',
            );
        },
    });
}

// ── Update ────────────────────────────────────────────────────────────────────

export function useUpdatePricingRule() {
    const queryClient = useQueryClient();
    const { showToast } = useToast();

    return useMutation({
        mutationFn: ({ id, body }: { id: string; body: UpdatePricingRulePayload }) =>
            pricingRuleApi.update({ id, body }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: pricingRuleQueryKeys.ALL });
            showToast('success', 'Thành công', 'Cập nhật quy tắc giá thành công');
        },
        onError: (error: any) => {
            showToast(
                'error',
                'Thất bại',
                error?.response?.data?.message ?? 'Đã có lỗi xảy ra',
            );
        },
    });
}

// ── Area & Table selectors ────────────────────────────────────────────────────

/** Lấy areas của restaurant đang đăng nhập để dùng trong form select */
export function usePricingRuleAreaOptions() {
    const { data: restaurant } = useRestaurantMe();
    const restaurantId = restaurant?._id as string | undefined;

    const { data: areas = [], isLoading } = useGetAreas({ restaurantId: restaurantId ?? '' });

    const options = (areas as import('@/features/area/types/area.type').IArea[]).map((area) => ({
        id: area._id ?? '',
        text: area.name,
    }));

    return { options, isLoading };
}

/** Lấy tất cả bàn (flat) của restaurant — reuse hook từ table-availabilities */
export function usePricingRuleTableOptions() {
    const { data: restaurant } = useRestaurantMe();
    const restaurantId = restaurant?._id as string | undefined;

    const { tables, isLoading } = useGetAllTablesForRestaurant(restaurantId);

    const options = tables.map((table) => ({
        id: table._id ?? '',
        text: table.tableNumber
            ? `${table.tableNumber}`
            : `Bàn ${table._id?.slice(-4)}`,
    }));

    return { options, isLoading };
}
