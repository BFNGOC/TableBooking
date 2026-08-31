import useTable from '@/shared/hooks/useTable';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/shared/hooks/useToast';
import { reviewApi } from '../api/review-api';
import { reviewQueryKeys } from '../constants/query-key';
import { IReview } from '../types/review.type';
import {
    CreateReviewPayload,
    FindReviewsParams,
    ReplyReviewPayload,
    UpdateReviewPayload,
} from '../types/review.dto';

// ── Public: dùng cho restaurant detail page ───────────────────────────────────

export function useRestaurantReviews(restaurantId: string) {
    return useTable<IReview, FindReviewsParams>({
        queryKey: reviewQueryKeys.BY_RESTAURANT(restaurantId),
        fetchApi: (params) => reviewApi.getReviews({ ...params, restaurantId }),
    });
}

// ── Restaurant dashboard: có thêm removeApi ───────────────────────────────────

export function useRestaurantReviewTable(restaurantId: string) {
    return useTable<IReview, FindReviewsParams>({
        queryKey: reviewQueryKeys.BY_RESTAURANT(restaurantId),
        fetchApi: (params) => reviewApi.getReviews({ ...params, restaurantId }),
        removeApi: (id) => reviewApi.deleteReview(id),
    });
}

// ── Customer mutations ─────────────────────────────────────────────────────────

export function useCreateReview(restaurantId?: string) {
    const queryClient = useQueryClient();
    const { showToast } = useToast();

    return useMutation({
        mutationFn: (payload: CreateReviewPayload) => reviewApi.createReview(payload),
        onSuccess: () => {
            if (restaurantId) {
                queryClient.invalidateQueries({
                    queryKey: reviewQueryKeys.BY_RESTAURANT(restaurantId),
                });
            }
            queryClient.invalidateQueries({ queryKey: reviewQueryKeys.MY });
            showToast('success', 'Thành công', 'Đánh giá của bạn đã được gửi.');
        },
        onError: (error: any) => {
            showToast(
                'error',
                'Gửi đánh giá thất bại',
                error?.response?.data?.message ?? 'Đã có lỗi xảy ra, vui lòng thử lại.',
            );
        },
    });
}

export function useUpdateReview(restaurantId?: string) {
    const queryClient = useQueryClient();
    const { showToast } = useToast();

    return useMutation({
        mutationFn: ({ id, body }: { id: string; body: UpdateReviewPayload }) =>
            reviewApi.updateReview({ id, body }),
        onSuccess: () => {
            if (restaurantId) {
                queryClient.invalidateQueries({
                    queryKey: reviewQueryKeys.BY_RESTAURANT(restaurantId),
                });
            }
            queryClient.invalidateQueries({ queryKey: reviewQueryKeys.MY });
            showToast('success', 'Thành công', 'Đánh giá đã được cập nhật.');
        },
        onError: (error: any) => {
            showToast(
                'error',
                'Cập nhật thất bại',
                error?.response?.data?.message ?? 'Đã có lỗi xảy ra, vui lòng thử lại.',
            );
        },
    });
}

// ── Restaurant mutations ───────────────────────────────────────────────────────

export function useReplyReview(restaurantId?: string) {
    const queryClient = useQueryClient();
    const { showToast } = useToast();

    return useMutation({
        mutationFn: ({ id, body }: { id: string; body: ReplyReviewPayload }) =>
            reviewApi.replyReview({ id, body }),
        onSuccess: () => {
            if (restaurantId) {
                queryClient.invalidateQueries({
                    queryKey: reviewQueryKeys.BY_RESTAURANT(restaurantId),
                });
            }
            showToast('success', 'Thành công', 'Phản hồi đã được gửi.');
        },
        onError: (error: any) => {
            showToast(
                'error',
                'Phản hồi thất bại',
                error?.response?.data?.message ?? 'Đã có lỗi xảy ra, vui lòng thử lại.',
            );
        },
    });
}

export function useDeleteReply(restaurantId?: string) {
    const queryClient = useQueryClient();
    const { showToast } = useToast();

    return useMutation({
        mutationFn: (id: string) => reviewApi.deleteReply(id),
        onSuccess: () => {
            if (restaurantId) {
                queryClient.invalidateQueries({
                    queryKey: reviewQueryKeys.BY_RESTAURANT(restaurantId),
                });
            }
            showToast('success', 'Thành công', 'Phản hồi đã được xóa.');
        },
        onError: (error: any) => {
            showToast(
                'error',
                'Xóa phản hồi thất bại',
                error?.response?.data?.message ?? 'Đã có lỗi xảy ra, vui lòng thử lại.',
            );
        },
    });
}
