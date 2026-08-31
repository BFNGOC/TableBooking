'use client';

interface StarRatingDisplayProps {
    rating: number;
    size?: 'sm' | 'md' | 'lg';
    showNumber?: boolean;
}

const sizeMap = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-2xl',
};

export default function StarRatingDisplay({
    rating,
    size = 'sm',
    showNumber = false,
}: StarRatingDisplayProps) {
    const fullStars = Math.floor(rating);
    const hasHalf = rating - fullStars >= 0.5;

    return (
        <div className="flex items-center gap-1">
            <div className={`flex items-center ${sizeMap[size]}`}>
                {[1, 2, 3, 4, 5].map((star) => {
                    if (star <= fullStars) {
                        return (
                            <span key={star} className="text-[#f59e0b]">
                                ★
                            </span>
                        );
                    }
                    if (star === fullStars + 1 && hasHalf) {
                        return (
                            <span key={star} className="relative inline-block">
                                <span className="text-gray-300">★</span>
                                <span
                                    className="absolute inset-0 overflow-hidden w-1/2 text-[#f59e0b]"
                                    aria-hidden
                                >
                                    ★
                                </span>
                            </span>
                        );
                    }
                    return (
                        <span key={star} className="text-gray-300">
                            ★
                        </span>
                    );
                })}
            </div>
            {showNumber && (
                <span className="text-sm font-semibold text-[#6f4e37]">
                    {rating.toFixed(1)}
                </span>
            )}
        </div>
    );
}
