'use client';

import { CalendarDays } from 'lucide-react';

export default function BookingEmpty({ message }: { message: string }) {
    return (
        <div className="rounded-[28px] border border-dashed border-[#decfc5] bg-white px-6 py-14 text-center">
            <CalendarDays size={36} className="mx-auto text-[#b9a99f]" />

            <p className="mt-3 text-sm text-[#8a7d75]">{message}</p>
        </div>
    );
}
