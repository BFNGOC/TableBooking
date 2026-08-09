'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Clock3, Users, MapPin, QrCode } from 'lucide-react';
import { formatDate } from '@/shared/utils/date';
import BookingStatusBadge from '../BookingStatusBadge';

export default function UpcomingBookingCard({ booking }: { booking: any }) {
    return (
        <Link
            href={`/discover/${booking.restaurantId?.slug}/booking/checkout/${booking._id}`}
            className="group block overflow-hidden rounded-[28px] border border-[#eee2da] bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
        >
            <div className="grid grid-cols-1 md:grid-cols-[260px_1fr]">
                <div className="relative h-56 overflow-hidden md:h-full md:min-h-[260px]">
                    <Image
                        src={booking.restaurantId?.avatar.url}
                        alt={booking.restaurantId?.restaurantName}
                        fill
                        className="object-cover transition duration-500 group-hover:scale-105"
                    />

                    <div className="absolute left-4 top-4 rounded-full bg-[#765237] px-3 py-1.5 text-xs font-semibold text-white">
                        Sắp tới
                    </div>
                </div>

                <div className="p-6">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <h3 className="text-xl font-semibold text-[#211b18]">
                                {booking.restaurantId?.restaurantName}
                            </h3>

                            <BookingStatusBadge status={booking.status} />
                        </div>
                    </div>

                    <div className="mt-5 space-y-3 text-sm text-[#625850]">
                        <div className="flex items-start gap-3">
                            <span className="mt-0.5 text-[#765237]">
                                <Clock3 size={18} />
                            </span>
                            <span>
                                {formatDate(booking.bookingDate)} • {booking.startTime}
                                {booking.endTime ? ` - ${booking.endTime}` : ''}
                            </span>
                        </div>

                        <div className="flex items-start gap-3">
                            <span className="mt-0.5 text-[#765237]">
                                <Users size={18} />
                            </span>
                            <span>{booking.guestCount} khách</span>
                        </div>

                        <div className="flex items-start gap-3">
                            <span className="mt-0.5 text-[#765237]">
                                <MapPin size={18} />
                            </span>
                            <span>{booking.restaurantId?.address ?? 'Chưa cập nhật địa chỉ'}</span>
                        </div>
                    </div>

                    {booking.checkInCode && (
                        <div className="mt-6 flex items-center justify-between border-t border-[#eee2da] pt-5">
                            <div>
                                <p className="text-xs font-medium uppercase tracking-wider text-[#9a8c83]">
                                    Mã check-in
                                </p>

                                <p className="mt-1 text-lg font-bold tracking-wider text-[#211b18]">
                                    {booking.checkInCode}
                                </p>
                            </div>

                            <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-[#eee2da]">
                                <QrCode size={32} className="text-[#211b18]" />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Link>
    );
}
