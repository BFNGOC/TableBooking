'use client';

import { IReview } from '../types/review.type';
import StarRatingDisplay from './StarRatingDisplay';

interface ReviewRatingSummaryProps {
    reviews: IReview[];
    totalItems: number;
    avgRating: number;
}

export default function ReviewRatingSummary({
    reviews,
    totalItems,
    avgRating,
}: ReviewRatingSummaryProps) {
    // Count by star from current page data (approximation)
    const counts = [5, 4, 3, 2, 1].map((star) => ({
        star,
        count: reviews.filter((r) => r.rating === star).length,
    }));
    const maxCount = Math.max(...counts.map((c) => c.count), 1);

    return (
        <div className="flex flex-col sm:flex-row gap-6 rounded-2xl border border-[#e6d8c9]/60 bg-[#fdf8f5] px-6 py-5">
            {/* Left: avg score */}
            <div className="flex flex-col items-center justify-center gap-1 min-w-[100px]">
                <span className="text-5xl font-extrabold text-[#3d2a21]">
                    {avgRating.toFixed(1)}
                </span>
                <StarRatingDisplay rating={avgRating} size="md" />
                <span className="text-xs text-[#8a7d75] mt-0.5">{totalItems} đánh giá</span>
            </div>

            {/* Divider */}
            <div className="hidden sm:block w-px bg-[#e6d8c9]" />

            {/* Right: breakdown bars */}
            <div className="flex-1 flex flex-col justify-center gap-2">
                {counts.map(({ star, count }) => {
                    const pct = totalItems > 0 ? Math.round((count / maxCount) * 100) : 0;
                    return (
                        <div key={star} className="flex items-center gap-2 text-xs">
                            <span className="w-8 shrink-0 text-right font-medium text-[#6f4e37]">
                                {star}★
                            </span>
                            <div className="flex-1 h-2 rounded-full bg-[#e6d8c9] overflow-hidden">
                                <div
                                    className="h-full rounded-full bg-[#f59e0b] transition-all duration-500"
                                    style={{ width: `${pct}%` }}
                                />
                            </div>
                            <span className="w-6 shrink-0 text-[#8a7d75]">{count}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
