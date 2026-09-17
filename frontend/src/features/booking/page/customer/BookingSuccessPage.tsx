'use client';

import { useMemo, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { Button, Separator, Spinner } from '@heroui/react';
import {
    CheckCircle2,
    MapPin,
    Phone,
    Share2,
    CalendarPlus,
    XCircle,
    AlertCircle,
} from 'lucide-react';
import CustomCard from '@/shared/components/card/CustomCard';
import InfoValueCard from '@/features/booking/components/InfoValueCard';
import { useGetBookingDetail } from '@/features/booking/hook/useBookingMe';
import { formatDate, formatDateTime } from '@/shared/utils/date';
import { translateBookingStatus, translatePaymentStatus } from '../../utils/booking-status';
import ConfirmModal from '@/shared/components/modals/ConfirmModal';
import { BookingStatus } from '../../types/booking.type';
import { useCancelBooking } from '../../hook/useBooking';
import ModalCustom from '@/shared/components/modals/ModalCustom';
import BookingCheckInCard from '../../components/checkin/BookingCheckInCard';

function BookingSuccessPage() {
    const router = useRouter();
    const params = useParams();
    const searchParams = useSearchParams();

    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [reason, setReason] = useState('');
    const [isReasonModalOpen, setIsReasonModalOpen] = useState(false);

    const rawBookingId = params?.bookingId ?? searchParams.get('bookingId') ?? '';
    const bookingId = Array.isArray(rawBookingId) ? rawBookingId[0] : String(rawBookingId);

    const { data, isPending, isError, error } = useGetBookingDetail(bookingId);

    const { mutate: cancelBooking } = useCancelBooking();

    const booking = useMemo(() => {
        const payload = data?.data;
        if (!payload) return null;
        return payload.booking ?? payload;
    }, [data]);

    const bookingDate = booking?.bookingDate ? formatDate(booking.bookingDate) : '—';
    const bookingTime = booking?.startTime ?? '—';
    const guestCount = booking?.guestCount ?? '—';
    const tableInfo = booking?.tableIds
        ? booking.tableIds
              .map((table: any) =>
                  typeof table === 'string' ? table : (table.tableNumber ?? table.name ?? '—')
              )
              .join(', ')
        : '—';
    const contactName = booking?.contactName ?? '—';
    const bookingStatus = translateBookingStatus(booking?.status);
    const paymentStatus = translatePaymentStatus(booking?.paymentStatus);
    const depositAmount = booking?.pricingSnapshot?.depositAmount ?? booking?.depositAmount ?? 0;
    const totalAmount = booking?.pricingSnapshot?.finalPrice ?? booking?.depositAmount ?? 0;
    const restaurantName =
        booking?.restaurantId?.restaurantName ?? booking?.restaurantName ?? 'Nhà hàng';
    const restaurantSlug = booking?.restaurantId?.slug;

    console.log('restaurantSlug', restaurantSlug);

    const isPendingBooking = booking?.status === BookingStatus.PENDING;
    const isCancelled = booking?.status === BookingStatus.CANCELLED;
    const isRejected = booking?.status === BookingStatus.REJECTED;
    const isCheckedIn = booking?.status === BookingStatus.CHECKED_IN;
    const isCompleted = booking?.status === BookingStatus.COMPLETED;
    const isNoShow = booking?.status === BookingStatus.NO_SHOW;

    const canCancel =
        booking?.status === BookingStatus.PENDING || booking?.status === BookingStatus.CONFIRMED;

    const cancellationReason = booking?.cancelReason ?? '—';
    const rejectionReason = booking?.rejectionReason ?? '—';

    let pageTitle = 'Đặt bàn thành công!';
    let pageSubtitle = 'Chúng tôi rất mong được đón tiếp bạn.';

    if (isCancelled) {
        pageTitle = 'Đã hủy đặt bàn';
        pageSubtitle = 'Đơn đặt bàn của bạn đã được hủy.';
    } else if (isRejected) {
        pageTitle = 'Đơn đặt bàn bị từ chối';
        pageSubtitle = 'Đơn đặt bàn của bạn đã bị nhà hàng từ chối.';
    } else if (isCheckedIn) {
        pageTitle = 'Đã Check-in thành công!';
        pageSubtitle = 'Bạn đã làm thủ tục check-in tại nhà hàng. Chúc bạn có bữa ăn ngon miệng!';
    } else if (isCompleted) {
        pageTitle = 'Hoàn thành đặt bàn';
        pageSubtitle = 'Cảm ơn bạn đã sử dụng dịch vụ tại nhà hàng.';
    } else if (isNoShow) {
        pageTitle = 'Vắng mặt (No-show)';
        pageSubtitle = 'Đơn đặt bàn đã quá khung giờ phục vụ nhưng không nhận được check-in.';
    } else if (isPendingBooking) {
        pageTitle = 'Đặt bàn đang chờ thanh toán hoặc xử lý';
        pageSubtitle = 'Đơn đặt bàn của bạn đang chờ thanh toán hoặc xử lý.';
    }

    const handleBackToRestaurant = () => {
        router.push('/');
    };

    const handleCancelBooking = () => {
        setIsConfirmModalOpen(true);
    };

    const handlePayment = () => {
        if (!restaurantSlug || !bookingId) return;

        router.push(`/restaurants/${restaurantSlug}/booking/checkout/${bookingId}`);
    };

    const handleConfirmCancelBooking = () => {
        setIsReasonModalOpen(true);
        setIsConfirmModalOpen(false);
    };

    const handleConfirmCancelBookingWithReason = () => {
        cancelBooking({
            bookingId,
            reason,
        });
        setIsReasonModalOpen(false);
    };

    if (!bookingId) {
        return (
            <div className="flex h-full items-center justify-center p-8">
                <CustomCard className="max-w-3xl mx-auto p-6 text-center">
                    <h2 className="text-xl font-semibold">Không tìm thấy Booking</h2>
                    <p className="mt-2 text-sm text-gray-500">
                        Liên kết này thiếu bookingId. Vui lòng kiểm tra lại đường dẫn.
                    </p>
                    <div className="mt-6">
                        <Button
                            type="button"
                            className="rounded-full bg-[#6f4e37] px-8 py-3 text-white"
                            onPress={handleBackToRestaurant}
                        >
                            Quay về nhà hàng
                        </Button>
                    </div>
                </CustomCard>
            </div>
        );
    }

    if (isPending) {
        return (
            <div className="flex h-full items-center justify-center p-8">
                <Spinner />
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex h-full items-center justify-center p-8">
                <CustomCard className="max-w-3xl mx-auto p-6 text-center">
                    <h2 className="text-xl font-semibold">Lỗi tải thông tin booking</h2>
                    <p className="mt-2 text-sm text-gray-500">
                        {String(error?.message ?? 'Đã xảy ra lỗi khi lấy thông tin đặt bàn.')}
                    </p>
                    <div className="mt-6">
                        <Button
                            type="button"
                            className="rounded-full bg-[#6f4e37] px-8 py-3 text-white"
                            onPress={handleBackToRestaurant}
                        >
                            Quay lại
                        </Button>
                    </div>
                </CustomCard>
            </div>
        );
    }

    return (
        <div className="mx-auto flex w-full max-w-7xl flex-col py-3 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
                <div
                    className={`mx-auto mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full shadow-sm ${
                        isCancelled || isRejected || isNoShow
                            ? 'bg-red-100 text-red-600'
                            : isCheckedIn
                              ? 'bg-emerald-100 text-emerald-600'
                              : 'bg-[#f3e7dc] text-[#865b3b]'
                    }`}
                >
                    {isCancelled || isRejected || isNoShow ? (
                        <XCircle size={36} />
                    ) : isCheckedIn ? (
                        <CheckCircle2 size={36} />
                    ) : (
                        <CheckCircle2 size={36} />
                    )}
                </div>
                <h1 className="text-3xl font-semibold text-[#1f2937]">{pageTitle}</h1>
                <p className="mt-3 text-sm text-[#5f5a55]">{pageSubtitle}</p>
            </div>

            <div className="mt-8 grid gap-6 lg:grid-cols-[380px_1fr]">
                <div className="space-y-6 rounded-[32px] border border-[#ece2d8] bg-[#f5efeb] p-6 shadow-sm">
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <p className="text-xs uppercase tracking-[0.24em] text-gray-500">
                                Mã đặt bàn
                            </p>
                            <p className="mt-2 text-3xl font-semibold text-[#1f2937]">
                                #{booking?._id ?? bookingId}
                            </p>
                        </div>
                    </div>

                    {isCheckedIn ? (
                        <div className="rounded-2xl border border-emerald-300 bg-emerald-50 p-4 text-center text-emerald-900">
                            <p className="font-semibold text-emerald-800">
                                ✓ Đã làm thủ tục Check-in
                            </p>
                            {booking?.checkedInAt && (
                                <p className="mt-1 text-xs text-emerald-700">
                                    Lúc {formatDateTime(booking.checkedInAt, 'HH:mm • DD/MM/YYYY')}
                                </p>
                            )}
                        </div>
                    ) : (
                        booking?.checkInToken &&
                        !isCancelled &&
                        !isRejected && (
                            <BookingCheckInCard
                                checkInToken={booking.checkInToken}
                                checkInCode={booking.checkInCode}
                            />
                        )
                    )}

                    <div className="space-y-3 rounded-3xl border border-[#efe1d5] bg-[#fff7f1] p-4 text-sm text-[#5f5a55]">
                        <p className="font-semibold text-[#1f2937]">Thông tin nhà hàng</p>
                        <p>{restaurantName}</p>
                        <p>
                            {bookingDate} • {bookingTime}
                        </p>
                        <p>Bàn: {tableInfo}</p>
                    </div>
                </div>

                <CustomCard className="bg-white">
                    <div>
                        <div className="grid gap-4">
                            <InfoValueCard label="Khách hàng" value={contactName} />
                            <InfoValueCard label="Số lượng" value={`${guestCount} người`} />
                            <InfoValueCard
                                label="Thời gian"
                                value={`${bookingTime} • ${bookingDate}`}
                            />
                            <InfoValueCard label="Vị trí bàn" value={tableInfo} />

                            <InfoValueCard label="Trạng thái" value={bookingStatus} />
                            <InfoValueCard label="Thanh toán" value={paymentStatus} />
                            <InfoValueCard
                                label="Tiền cọc"
                                value={`${depositAmount?.toLocaleString?.() ?? 0}đ`}
                            />
                            <InfoValueCard
                                label="Tổng tiền"
                                value={`${totalAmount?.toLocaleString?.() ?? 0}đ`}
                            />
                            {isCancelled && (
                                <InfoValueCard label="Lý do hủy" value={cancellationReason} />
                            )}
                            {isRejected && (
                                <InfoValueCard label="Lý do từ chối" value={rejectionReason} />
                            )}
                            <div className="text-sm">
                                <span className="text-gray-500">Ghi chú khách hàng:</span>
                                <div className="mt-2 rounded-xl border border-gray-200 bg-white p-3 text-sm text-gray-700 whitespace-pre-wrap break-words">
                                    {booking?.restaurantNote ? booking.restaurantNote : '—'}
                                </div>
                            </div>
                        </div>
                    </div>

                    <Separator className="my-4" />

                    <div>
                        <div className="grid gap-3 mb-4 sm:grid-cols-4">
                            <Button
                                type="button"
                                className="inline-flex items-center justify-center gap-2 rounded-full border border-[#e4dacb] bg-white px-4 py-3 text-sm text-[#1f2937]"
                            >
                                <MapPin size={18} /> Xem chỉ đường
                            </Button>
                            <Button
                                type="button"
                                className="inline-flex items-center justify-center gap-2 rounded-full border border-[#e4dacb] bg-white px-4 py-3 text-sm text-[#1f2937]"
                            >
                                <CalendarPlus size={18} /> Thêm vào lịch
                            </Button>
                            <Button
                                type="button"
                                className="inline-flex items-center justify-center gap-2 rounded-full border border-[#e4dacb] bg-white px-4 py-3 text-sm text-[#1f2937]"
                            >
                                <Phone size={18} /> Gọi hotline
                            </Button>
                            <Button
                                type="button"
                                className="inline-flex items-center justify-center gap-2 rounded-full border border-[#e4dacb] bg-white px-4 py-3 text-sm text-[#1f2937]"
                            >
                                <Share2 size={18} /> Chia sẻ
                            </Button>
                        </div>
                    </div>

                    <Separator className="my-4" />

                    {/* Chỉ hiển thị nút Hủy đặt bàn khi đơn đang ở trạng thái PENDING hoặc CONFIRMED */}
                    {canCancel && (
                        <div className="flex flex-col items-center justify-center gap-3 text-center">
                            <div className="flex flex-wrap justify-center gap-3">
                                {isPendingBooking && (
                                    <Button
                                        type="button"
                                        className="bg-[#8b5e3c] px-6 py-4 text-base font-semibold text-white rounded-full"
                                        onPress={handlePayment}
                                        isDisabled={!restaurantSlug}
                                    >
                                        Thanh toán ngay
                                    </Button>
                                )}
                                <Button
                                    type="button"
                                    className="bg-[#6f4e37] px-6 py-4 text-base font-semibold text-white rounded-full"
                                    onPress={handleCancelBooking}
                                >
                                    Hủy đặt bàn
                                </Button>
                            </div>
                            <p className="text-center text-sm text-[#857468]">
                                Hoàn tiền 100% nếu hủy trước giờ hẹn 2 tiếng.
                            </p>
                        </div>
                    )}
                </CustomCard>
            </div>

            <ConfirmModal
                isOpen={isConfirmModalOpen}
                onClose={() => setIsConfirmModalOpen(false)}
                onConfirm={handleConfirmCancelBooking}
                title="Xác nhận hủy đặt bàn"
                description="Bạn có chắc chắn muốn hủy đặt bàn này không?"
            />

            <ModalCustom
                open={isReasonModalOpen}
                onOpenChange={() => setIsReasonModalOpen(false)}
                title="Lý do hủy đặt bàn"
            >
                <div>
                    <textarea
                        className="mt-4 w-full rounded-md border border-[#d1c8b9] bg-[#f9f5f0] p-3 text-sm text-[#1f2937] placeholder:text-[#a8a29e]"
                        placeholder="Nhập lý do hủy đặt bàn..."
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                    />
                    <div className="mt-4 flex justify-end gap-3">
                        <Button
                            type="button"
                            className="border border-[#e4dacb] bg-white px-4 py-2 text-sm text-[#1f2937]"
                            onPress={() => setIsReasonModalOpen(false)}
                        >
                            Hủy
                        </Button>
                        <Button
                            type="button"
                            className="bg-[#6f4e37] px-4 py-2 text-sm font-semibold text-white"
                            onPress={handleConfirmCancelBookingWithReason}
                        >
                            Xác nhận
                        </Button>
                    </div>
                </div>
            </ModalCustom>
        </div>
    );
}

export default BookingSuccessPage;
