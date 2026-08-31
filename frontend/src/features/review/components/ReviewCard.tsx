'use client';

import { IReview, IReviewUser } from '../types/review.type';
import StarRatingDisplay from './StarRatingDisplay';
import { formatDate } from '@/shared/utils/date';
import { Store, Pencil, Trash2, MessageSquareReply, X } from 'lucide-react';

interface ReviewCardProps {
    review: IReview;
    // Customer actions (edit/delete own review)
    showActions?: boolean;
    onEdit?: (review: IReview) => void;
    onDelete?: (id: string) => void;
    // Restaurant actions (reply / delete reply)
    showReplyActions?: boolean;
    onReply?: (review: IReview) => void;
    onDeleteReply?: (id: string) => void;
    isDeleting?: boolean;
}

function getUser(review: IReview): IReviewUser | null {
    if (!review.userId) return null;
    if (typeof review.userId === 'string') return null;
    return review.userId;
}

function UserAvatar({ user }: { user: IReviewUser | null }) {
    const initial = user?.name?.charAt(0)?.toUpperCase() ?? '?';
    if (user?.avatar?.url) {
        return (
            <img
                src={user.avatar.url}
                alt={user.name}
                className="h-10 w-10 rounded-full object-cover ring-2 ring-[#e6d8c9]"
            />
        );
    }
    return (
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#6f4e37] text-white font-bold text-sm ring-2 ring-[#e6d8c9]">
            {initial}
        </div>
    );
}

export default function ReviewCard({
    review,
    showActions,
    onEdit,
    onDelete,
    showReplyActions,
    onReply,
    onDeleteReply,
    isDeleting,
}: ReviewCardProps) {
    const user = getUser(review);
    const displayName = user?.name ?? 'Khách hàng ẩn danh';
    const createdDate = review.createdAt ? formatDate(String(review.createdAt)) : '';

    return (
        <div className="rounded-2xl border border-[#e6d8c9]/60 bg-white p-5 shadow-sm space-y-4">
            {/* Header */}
            <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                    <UserAvatar user={user} />
                    <div>
                        <p className="font-semibold text-[#3d2a21]">{displayName}</p>
                        <p className="text-xs text-[#8a7d75]">{createdDate}</p>
                    </div>
                </div>
                <StarRatingDisplay rating={review.rating} size="md" showNumber />
            </div>

            {/* Comment */}
            {review.comment && (
                <p className="text-sm text-[#5a4a40] leading-relaxed whitespace-pre-line">
                    {review.comment}
                </p>
            )}

            {/* Images */}
            {review.images && review.images.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {review.images.map((img, i) => (
                        <img
                            key={i}
                            src={img.url}
                            alt={`review-img-${i}`}
                            className="h-20 w-20 rounded-xl object-cover border border-[#e6d8c9]"
                        />
                    ))}
                </div>
            )}

            {/* Restaurant Reply */}
            {review.restaurantReply && (
                <div className="rounded-xl bg-[#fdf5ef] border border-[#e8d5c4] px-4 py-3 space-y-1">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-[#6f4e37]">
                            <Store size={13} />
                            Phản hồi từ nhà hàng
                        </div>
                        <span className="text-xs text-[#a89080]">
                            {review.restaurantReply.repliedAt
                                ? formatDate(String(review.restaurantReply.repliedAt))
                                : ''}
                        </span>
                    </div>
                    <p className="text-sm text-[#5a4a40] leading-relaxed">
                        {review.restaurantReply.content}
                    </p>
                </div>
            )}

            {/* Action buttons */}
            {(showActions || showReplyActions) && (
                <div className="flex items-center gap-2 pt-1 border-t border-[#f0e8e0]">
                    {/* Customer actions */}
                    {showActions && (
                        <>
                            <button
                                onClick={() => onEdit?.(review)}
                                className="flex items-center gap-1 text-xs font-medium text-[#6f4e37] hover:text-[#543d2b] transition-colors"
                            >
                                Sửa
                            </button>
                            <button
                                onClick={() => review._id && onDelete?.(review._id)}
                                disabled={isDeleting}
                                className="flex items-center gap-1 text-xs font-medium text-red-500 hover:text-red-700 transition-colors disabled:opacity-50"
                            >
                                Xóa
                            </button>
                        </>
                    )}

                    {/* Restaurant actions */}
                    {showReplyActions && (
                        <>
                            <button
                                onClick={() => onReply?.(review)}
                                className="flex items-center gap-1 text-xs font-medium text-[#6f4e37] hover:text-[#543d2b] transition-colors"
                            >
                                <MessageSquareReply size={13} />
                                {review.restaurantReply ? 'Sửa phản hồi' : 'Phản hồi'}
                            </button>
                            {review.restaurantReply && review._id && (
                                <button
                                    onClick={() => onDeleteReply?.(review._id!)}
                                    disabled={isDeleting}
                                    className="flex items-center gap-1 text-xs font-medium text-red-500 hover:text-red-700 transition-colors disabled:opacity-50"
                                >
                                    <X size={13} />
                                    Xóa phản hồi
                                </button>
                            )}
                        </>
                    )}
                </div>
            )}
        </div>
    );
}
