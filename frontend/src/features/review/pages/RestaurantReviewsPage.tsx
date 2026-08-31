'use client';

import { Skeleton } from '@heroui/react';
import { Star } from 'lucide-react';

import { useRestaurantMe } from '@/features/restaurant/hooks/useRestaurantMe';
import { useRestaurantReviewTable, useReplyReview, useDeleteReply } from '../hooks/useReview';
import { useFormModal } from '@/shared/hooks/useFormModal';
import { IReview } from '../types/review.type';
import TablePaginationCustom, {
    ColumnTable,
} from '@/shared/components/table/TablePaginationCustom';

import ReviewCard from '../components/ReviewCard';
import ReviewFilterBar from '../components/ReviewFilterBar';
import ReplyModal from '../components/ReplyModal';
import { FindReviewsParams } from '../types/review.dto';
import { Pagination } from '@heroui/react';

export default function RestaurantReviewsPage() {
    const { data: restaurant, isPending: restaurantLoading } = useRestaurantMe();
    const restaurantId = (restaurant as any)?._id as string | undefined;

    const {
        data,
        pagination,
        filterValues,
        loading,
        handleChangePage,
        handleFilterChange,
        handleFilterSubmit,
        handleDelete,
        deleting,
    } = useRestaurantReviewTable(restaurantId ?? '');

    const modal = useFormModal<IReview>();
    const replyMutation = useReplyReview(restaurantId);
    const deleteReplyMutation = useDeleteReply(restaurantId);

    const handleFilterRatingChange = (rating?: number) => {
        handleFilterChange({ ...(filterValues as FindReviewsParams), rating });
        handleFilterSubmit();
    };

    const handleReplySubmit = (reviewId: string, content: string) => {
        replyMutation.mutate(
            { id: reviewId, body: { content } },
            { onSuccess: modal.close },
        );
    };

    const handleDeleteReply = (reviewId: string) => {
        deleteReplyMutation.mutate(reviewId);
    };

    if (restaurantLoading) {
        return (
            <div className="space-y-4">
                <Skeleton className="h-8 w-48 rounded-xl" />
                <Skeleton className="h-32 rounded-2xl" />
                <Skeleton className="h-32 rounded-2xl" />
            </div>
        );
    }

    const avgRating = (restaurant as any)?.rating ?? 0;

    return (
        <div className="flex flex-col gap-6">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-xl font-bold text-[#4a3728]">Quản lý Đánh giá</h1>
                    <p className="mt-0.5 text-sm text-gray-500">
                        Xem và phản hồi đánh giá từ thực khách
                    </p>
                </div>
                {avgRating > 0 && (
                    <div className="flex items-center gap-1.5 rounded-full bg-[#fdf5ef] border border-[#e6d8c9] px-4 py-1.5">
                        <Star size={15} className="fill-[#f59e0b] text-[#f59e0b]" />
                        <span className="text-sm font-bold text-[#6f4e37]">
                            {Number(avgRating).toFixed(1)}
                        </span>
                        <span className="text-xs text-[#a89080]">
                            ({pagination.totalItems} đánh giá)
                        </span>
                    </div>
                )}
            </div>

            {/* Filter */}
            <ReviewFilterBar
                value={(filterValues as FindReviewsParams)?.rating}
                onChange={handleFilterRatingChange}
            />

            {/* Review list */}
            {loading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-32 rounded-2xl" />
                    ))}
                </div>
            ) : data.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-[#e6d8c9] bg-[#fdf8f5] py-16 text-center">
                    <p className="text-[#a89080] text-sm">Chưa có đánh giá nào.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {data.map((review) => (
                        <ReviewCard
                            key={review._id}
                            review={review}
                            showReplyActions
                            onReply={(r) => modal.openEdit(r)}
                            onDeleteReply={handleDeleteReply}
                            isDeleting={deleteReplyMutation.isPending}
                        />
                    ))}
                </div>
            )}

            {/* Pagination */}
            {pagination.totalPages > 1 && (
                <div className="flex justify-center">
                    <Pagination size="sm">
                        <Pagination.Content>
                            <Pagination.Item>
                                <Pagination.Previous
                                    isDisabled={pagination.currentPage === 1}
                                    onPress={() => handleChangePage(pagination.currentPage - 1)}
                                >
                                    <Pagination.PreviousIcon />
                                    Trước
                                </Pagination.Previous>
                            </Pagination.Item>

                            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                                .filter((p) => Math.abs(p - pagination.currentPage) <= 2)
                                .map((p) => (
                                    <Pagination.Item key={p}>
                                        <Pagination.Link
                                            isActive={p === pagination.currentPage}
                                            className={
                                                p === pagination.currentPage
                                                    ? 'bg-[#6f4e37] text-white font-semibold'
                                                    : 'text-gray-600 hover:bg-gray-100'
                                            }
                                            onPress={() => handleChangePage(p)}
                                        >
                                            {p}
                                        </Pagination.Link>
                                    </Pagination.Item>
                                ))}

                            <Pagination.Item>
                                <Pagination.Next
                                    isDisabled={pagination.currentPage === pagination.totalPages}
                                    onPress={() => handleChangePage(pagination.currentPage + 1)}
                                >
                                    Sau
                                    <Pagination.NextIcon />
                                </Pagination.Next>
                            </Pagination.Item>
                        </Pagination.Content>
                    </Pagination>
                </div>
            )}

            {/* Reply Modal */}
            <ReplyModal
                isOpen={modal.open}
                reviewId={modal.selectedRecord?._id ?? ''}
                currentContent={modal.selectedRecord?.restaurantReply?.content}
                onSubmit={handleReplySubmit}
                onClose={modal.close}
                isPending={replyMutation.isPending}
            />
        </div>
    );
}
