'use client';

import Link from 'next/link';
import { CalendarDays, History, ChevronRight, Heart } from 'lucide-react';
import { useGetBookingRecentMe, useGetBookingUpcomingMe } from '../../hook/useBookingMe';
import FavoriteRestaurantCard from '@/features/booking/components/FavoriteRestaurantCard';
import BookingEmpty from '@/features/booking/components/BookingEmpty';
import { UpcomingSkeleton, RecentSkeleton } from '@/features/booking/components/BookingSkeletons';
import UpcomingBookingCard from '../../components/MyBooking/UpcomingBookingCard';
import RecentBookingCard from '../../components/MyBooking/RecentBookingCard';

function MyBookingsPage() {
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
        <main className="min-h-screen mb-4 sm:px-6 lg:px-8">
            <div className="mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-semibold text-[#211b18]">Lịch đặt bàn của tôi</h1>

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
                                        <UpcomingBookingCard key={booking._id} booking={booking} />
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

                                <Link
                                    href="/my-bookings/history"
                                    className="flex items-center gap-1 text-sm font-medium text-[#8b5e3c] hover:underline"
                                >
                                    Xem tất cả
                                    <ChevronRight size={16} />
                                </Link>
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
                                        <RecentBookingCard key={booking._id} booking={booking} />
                                    ))}
                                </div>
                            )}
                        </section>
                    </div>

                    {/* RIGHT */}
                    <aside className="space-y-6">
                        {/* Point */}
                        <div className="rounded-[28px] bg-[#765237] p-6 text-white shadow-sm">
                            <p className="text-lg font-semibold text-[#f4d4bc]">Điểm tích lũy</p>

                            <div className="mt-4 flex items-end gap-2">
                                <span className="text-4xl font-bold">2,450</span>

                                <span className="mb-1 text-sm text-[#f0c8aa]">Gold Member</span>
                            </div>

                            <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/30">
                                <div className="h-full w-[82%] rounded-full bg-white" />
                            </div>

                            <p className="mt-2 text-xs text-[#e8c4a9]">
                                Còn 550 điểm để lên hạng Diamond
                            </p>

                            <button className="mt-5 w-full rounded-full bg-[#fffaf7] py-3 text-sm font-semibold text-[#765237] transition hover:bg-white">
                                Đổi ưu đãi ngay
                            </button>
                        </div>

                        {/* Favorite */}
                        <section>
                            <div className="mb-4 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Heart size={20} className="fill-red-600 text-red-600" />

                                    <h2 className="text-xl font-semibold text-[#211b18]">
                                        Nhà hàng yêu thích
                                    </h2>
                                </div>

                                <Link
                                    href="/favorites"
                                    className="text-sm font-medium text-[#8b5e3c] hover:underline"
                                >
                                    Xem tất cả
                                </Link>
                            </div>

                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1">
                                <FavoriteRestaurantCard
                                    name="The Sushi Bar"
                                    category="Ẩm thực Nhật Bản"
                                    rating="4.9"
                                    reviews="1.2k"
                                    image="/images/restaurant-sushi.jpg"
                                />

                                <FavoriteRestaurantCard
                                    name="Bistro de Paris"
                                    category="Ẩm thực Pháp"
                                    rating="4.7"
                                    reviews="850"
                                    image="/images/restaurant-paris.jpg"
                                />
                            </div>
                        </section>
                    </aside>
                </div>
            </div>
        </main>
    );
}

export default MyBookingsPage;
