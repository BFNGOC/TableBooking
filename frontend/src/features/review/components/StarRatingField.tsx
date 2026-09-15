'use client';

import { useState } from 'react';

interface StarRatingFieldProps {
    value: number;
    onChange: (value: number) => void;
    isDisabled?: boolean;
}

const LABELS: Record<number, string> = {
    1: 'Tệ',
    2: 'Không tốt',
    3: 'Bình thường',
    4: 'Tốt',
    5: 'Tuyệt vời',
};

export default function StarRatingField({ value, onChange, isDisabled }: StarRatingFieldProps) {
    const [hovered, setHovered] = useState(0);
    const active = hovered || value;

    return (
        <div className="flex flex-col gap-2">
            <span className="text-sm font-medium text-[#4a3728]">Đánh giá *</span>
            <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        type="button"
                        disabled={isDisabled}
                        onMouseEnter={() => !isDisabled && setHovered(star)}
                        onMouseLeave={() => !isDisabled && setHovered(0)}
                        onClick={() => !isDisabled && onChange(star)}
                        className={`text-3xl transition-transform duration-100 ${
                            !isDisabled ? 'hover:scale-110 cursor-pointer' : 'cursor-default'
                        }`}
                        aria-label={`${star} sao`}
                    >
                        <span
                            className={
                                star <= active
                                    ? 'text-[#f59e0b]'
                                    : 'text-gray-300'
                            }
                        >
                            ★
                        </span>
                    </button>
                ))}
                {active > 0 && (
                    <span className="ml-2 text-sm font-semibold text-[#6f4e37]">
                        {LABELS[active]}
                    </span>
                )}
            </div>
        </div>
    );
}
