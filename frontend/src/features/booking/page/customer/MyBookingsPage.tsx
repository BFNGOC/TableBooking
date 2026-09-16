'use client';

import { useState } from 'react';
import Link from 'next/link';
import { CalendarDays, History, ChevronRight, Heart } from 'lucide-react';
import { useGetBookingRecentMe, useGetBookingUpcomingMe } from '../../hook/useBookingMe';
import FavoriteRestaurantCard from '@/features/booking/components/FavoriteRestaurantCard';
import BookingEmpty from '@/features/booking/components/BookingEmpty';
import { UpcomingSkeleton, RecentSkeleton } from '@/features/booking/components/BookingSkeletons';
import UpcomingBookingCard from '../../components/my-booking/UpcomingBookingCard';
import RecentBookingCard from '../../components/my-booking/RecentBookingCard';
import ReviewFormModal from '@/features/review/components/ReviewFormModal';
import { useCreateReview } from '@/features/review/hooks/useReview';
import { IReview } from '@/features/review/types/review.type';
import { CreateReviewPayload } from '@/features/review/types/review.dto';

function MyBookingsPage() {
    const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
    const [reviewValues, setReviewValues] = useState<Partial<IReview> | null>(null);
    const createReviewMutation = useCreateReview();

    const handleWriteReview = (bookingId: string) => {
        setSelectedBookingId(bookingId);
        setReviewValues(null);
    };

    const handleReviewSubmit = (values: Partial<IReview>) => {
        createReviewMutation.mutate(values as CreateReviewPayload, {
            onSuccess: () => {
                setSelectedBookingId(null);
                setReviewValues(null);
            },
        });
    };
    const {
        data: upcomingData,
        isPending: isUpcomingPending,
        isError: isUpcomingError,
    } = useGetBookingUpcomingMe();

    const {
        data: recentData,
        isPending: isRecentPending,
        isError: isRecentError,
    } = useGetBookingRecentMe();

    const upcomingBookings = upcomingData ?? [];
    const recentBookings = recentData ?? [];

    return (
        <>
            <main className="min-h-screen mb-4 sm:px-6 lg:px-8">
                <div className="mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-2xl font-semibold text-[#211b18]">
                            Lịch đặt bàn của tôi
                        </h1>

                        <p className="mt-1 text-sm text-[#8a7d75]">
                            Quản lý các lịch hẹn và lịch sử đặt bàn của bạn
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_320px]">
                        {/* LEFT */}
                        <div className="min-w-0 space-y-10">
                            {/* Upcoming */}
                            <section>
                                <div className="mb-4 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <CalendarDays size={22} className="text-[#8b5e3c]" />

                                        <h2 className="text-xl font-semibold text-[#211b18]">
                                            Lịch hẹn sắp tới
                                        </h2>
                                    </div>

                                    {upcomingBookings.length > 0 && (
                                        <span className="rounded-full bg-[#f2e5dc] px-3 py-1 text-xs font-medium text-[#7b5136]">
                                            {upcomingBookings.length} lịch hẹn
                                        </span>
                                    )}
                                </div>

                                {isUpcomingPending ? (
                                    <UpcomingSkeleton />
                                ) : isUpcomingError ? (
                                    <BookingEmpty message="Không thể tải lịch hẹn sắp tới." />
                                ) : upcomingBookings.length === 0 ? (
                                    <BookingEmpty message="Bạn chưa có lịch hẹn sắp tới." />
                                ) : (
                                    <div className="space-y-5">
                                        {upcomingBookings.map((booking) => (
                                            <UpcomingBookingCard
                                                key={booking._id}
                                                booking={booking}
                                            />
                                        ))}
                                    </div>
                                )}
                            </section>

                            {/* Recent */}
                            <section>
                                <div className="mb-4 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <History size={22} className="text-[#8b5e3c]" />

                                        <h2 className="text-xl font-semibold text-[#211b18]">
                                            Gần đây
                                        </h2>
                                    </div>
                                </div>

                                {isRecentPending ? (
                                    <RecentSkeleton />
                                ) : isRecentError ? (
                                    <BookingEmpty message="Không thể tải lịch sử đặt bàn." />
                                ) : recentBookings.length === 0 ? (
                                    <BookingEmpty message="Bạn chưa có lịch sử đặt bàn." />
                                ) : (
                                    <div className="space-y-3">
                                        {recentBookings.map((booking) => (
                                            <RecentBookingCard
                                                key={booking._id}
                                                booking={booking}
                                                onWriteReview={handleWriteReview}
                                            />
                                        ))}
                                    </div>
                                )}
                            </section>
                        </div>
                    </div>
                </div>
            </main>

            {/* Review Form Modal — triggered from RecentBookingCard */}
            <ReviewFormModal
                isOpen={!!selectedBookingId}
                mode="create"
                values={reviewValues}
                onValuesChange={setReviewValues as any}
                onSubmit={handleReviewSubmit}
                onClose={() => {
                    setSelectedBookingId(null);
                    setReviewValues(null);
                }}
                isPending={createReviewMutation.isPending}
                bookingId={selectedBookingId ?? undefined}
            />
        </>
    );
}

export default MyBookingsPage;
