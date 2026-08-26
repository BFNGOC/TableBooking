import Link from 'next/link';
import { Card, Chip } from '@heroui/react';
import { Eye, XCircle } from 'lucide-react';
import { UpcomingBooking } from '../types/dashboard.type';

const statusLabel: Record<string, string> = {
    CONFIRMED: 'Đã xác nhận',
    PENDING: 'Chờ duyệt',
    CANCELLED: 'Đã huỷ',
    CHECKED_IN: 'Đã check-in',
};
const dateText = (value: string | Date) =>
    new Date(value).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });

export function UpcomingBookingsTable({ bookings }: { bookings: UpcomingBooking[] }) {
    return (
        <Card className="overflow-hidden border-0 bg-white shadow-[0_8px_24px_rgba(76,53,38,0.06)]">
            <div className="flex items-center justify-between border-b border-[#f0e7e2] px-5 py-4">
                <h2 className="text-base font-bold text-[#49382f]">Đặt bàn mới nhất</h2>
                <Link
                    href="/restaurant/dashboard/bookings/upcoming"
                    className="text-xs font-medium text-[#8f6552] hover:underline"
                >
                    Xem tất cả →
                </Link>
            </div>
            <div className="hidden grid-cols-[1.5fr_.55fr_1fr_1fr_.5fr] gap-3 bg-[#fcfaf9] px-5 py-3 text-[9px] font-semibold uppercase tracking-wide text-[#a18f86] md:grid">
                <span>Tên khách</span>
                <span>Số người</span>
                <span>Thời gian</span>
                <span>Trạng thái</span>
                <span>Hành động</span>
            </div>
            {bookings.length === 0 ? (
                <p className="px-5 py-10 text-center text-sm text-[#a18f86]">
                    Chưa có đặt bàn sắp tới
                </p>
            ) : (
                bookings.map((booking) => (
                    <div
                        key={booking._id ?? `${booking.contactName}-${booking.bookingDate}`}
                        className="grid gap-3 border-t border-[#f3ebe7] px-5 py-4 md:grid-cols-[1.5fr_.55fr_1fr_1fr_.5fr] md:items-center"
                    >
                        <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f0e1d9] text-[11px] font-bold text-[#74503e]">
                                {(booking.contactName ?? 'K').slice(0, 1)}
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-[#49382f]">
                                    {booking.contactName ?? 'Khách đặt bàn'}
                                </p>
                                <p className="text-[10px] text-[#a18f86]">
                                    {booking.contactPhone ?? 'Khách hàng'}
                                </p>
                            </div>
                        </div>
                        <span className="text-xs text-[#59443a]">{booking.guestCount} người</span>
                        <span className="text-xs text-[#59443a]">
                            {booking.startTime}, {dateText(booking.bookingDate)}
                        </span>
                        <Chip
                            size="sm"
                            color={
                                booking.status === 'CONFIRMED'
                                    ? 'success'
                                    : booking.status === 'CANCELLED'
                                      ? 'danger'
                                      : 'warning'
                            }
                            variant="soft"
                        >
                            {statusLabel[booking.status ?? ''] ?? 'Đang xử lý'}
                        </Chip>
                        <div className="flex gap-2 text-[#8e6f60]">
                            <Link
                                href={
                                    booking._id
                                        ? `/restaurant/dashboard/bookings/${booking._id}`
                                        : '#'
                                }
                                aria-label="Xem chi tiết"
                            >
                                <Eye size={15} />
                            </Link>
                            <button type="button" aria-label="Huỷ đặt bàn">
                                <XCircle size={15} />
                            </button>
                        </div>
                    </div>
                ))
            )}
        </Card>
    );
}
