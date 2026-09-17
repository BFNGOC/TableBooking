'use client';

import { getBookingStatusText } from '../utils/booking-status';

export default function BookingStatusBadge({ status }: { status?: string }) {
    return (
        <span className="mt-2 inline-flex rounded-full bg-[#e3f3f8] px-3 py-1 text-xs font-semibold text-[#24738a]">
            {getBookingStatusText(status ?? '')}
        </span>
    );
}
