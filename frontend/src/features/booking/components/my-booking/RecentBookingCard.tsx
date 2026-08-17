'use client';

import Link from 'next/link';
import { formatDate } from '@/shared/utils/date';
import { getBookingStatusText } from '../../utils/booking-status';
import { formatMoney } from '../../utils/booking-helpers';

export default function RecentBookingCard({ booking }: { booking: any }) {
    const isCancelled = booking.status === 'CANCELLED';

    return (
        <Link
            href={`/my-bookings/${booking._id}`}
            className={`flex items-center justify-between gap-4 rounded-2xl border-l-4 bg-white px-5 py-4 shadow-sm transition hover:shadow-md ${
                isCancelled ? 'border-red-500' : 'border-[#765237]'
            }`}
        >
            <div className="min-w-0">
                <h3 className="truncate font-semibold text-[#211b18]">
                    {booking.restaurantId?.restaurantName}
                </h3>

                <p className="mt-1 text-sm text-[#8a7d75]">
                    {formatDate(booking.bookingDate)} • {booking.guestCount} khách
                </p>
            </div>

            <div className="shrink-0 text-right">
                <p
                    className={`text-sm font-semibold ${isCancelled ? 'text-red-500' : 'text-[#765237]'}`}
                >
                    {getBookingStatusText(booking.status)}
                </p>

                {booking.pricingSnapshot?.finalPrice != null && (
                    <p className="mt-1 text-xs text-[#8a7d75]">
                        {formatMoney(booking.pricingSnapshot.finalPrice)}
                    </p>
                )}
            </div>
        </Link>
    );
}
