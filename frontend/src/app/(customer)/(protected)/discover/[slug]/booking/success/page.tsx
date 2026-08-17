'use client';

import { useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { Spinner } from '@heroui/react';

function BookingSuccessRedirect() {
    const router = useRouter();
    const params = useParams();
    const searchParams = useSearchParams();

    const rawBookingId = searchParams.get('bookingId') ?? '';
    const bookingId = Array.isArray(rawBookingId) ? rawBookingId[0] : rawBookingId;
    const rawSlug = params?.slug ?? '';
    const slug = Array.isArray(rawSlug) ? rawSlug[0] : String(rawSlug);

    useEffect(() => {
        if (!bookingId) return;
        router.replace(`/discover/${slug}/booking/success/${bookingId}`);
    }, [bookingId, router, slug]);

    return (
        <div className="flex h-full items-center justify-center">
            <Spinner />
        </div>
    );
}

export default BookingSuccessRedirect;
