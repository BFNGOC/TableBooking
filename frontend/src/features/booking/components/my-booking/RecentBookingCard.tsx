'use client';

import Link from 'next/link';
import { PenLine } from 'lucide-react';
import { formatDate } from '@/shared/utils/date';
import { getBookingStatusText } from '../../utils/booking-status';
import { formatMoney } from '../../utils/booking-helpers';

interface RecentBookingCardProps {
    booking: any;
    onWriteReview?: (bookingId: string) => void;
}

export default function RecentBookingCard({ booking, onWriteReview }: RecentBookingCardProps) {
    const isCancelled = booking.status === 'CANCELLED';
    const isCompleted = booking.status === 'COMPLETED';

    return (
        <div
            className={`flex items-center justify-between gap-4 rounded-2xl border-l-4 bg-white px-5 py-4 shadow-sm transition hover:shadow-md ${
                isCancelled ? 'border-red-500' : 'border-[#765237]'
            }`}
        >
            <Link
                href={`/my-bookings/${booking._id}`}
                className="min-w-0 flex-1"
            >
                <h3 className="truncate font-semibold text-[#211b18]">
                    {booking.restaurantId?.restaurantName}
                </h3>

                <p className="mt-1 text-sm text-[#8a7d75]">
                    {formatDate(booking.bookingDate)} • {booking.guestCount} khách
                </p>
            </Link>

            <div className="shrink-0 flex flex-col items-end gap-1.5">
                <p
                    className={`text-sm font-semibold ${isCancelled ? 'text-red-500' : 'text-[#765237]'}`}
                >
                    {getBookingStatusText(booking.status)}
                </p>

                {booking.pricingSnapshot?.finalPrice != null && (
                    <p className="text-xs text-[#8a7d75]">
                        {formatMoney(booking.pricingSnapshot.finalPrice)}
                    </p>
                )}

                {isCompleted && onWriteReview && (
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            onWriteReview(booking._id);
                        }}
                        className="flex items-center gap-1 text-xs font-semibold text-[#6f4e37] hover:text-[#543d2b] hover:underline transition-colors"
                    >
                        <PenLine size={11} />
                        Viết đánh giá
                    </button>
                )}
            </div>
        </div>
    );
}
