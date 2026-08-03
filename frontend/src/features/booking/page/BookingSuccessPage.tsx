'use client';

import { useMemo } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { Button, Spinner } from '@heroui/react';
import CustomCard from '@/shared/components/card/CustomCard';
import { useGetBooking } from '@/features/booking/hook/useBookingMe';
import { formatDate } from '@/shared/utils/date';

const translateBookingStatus = (status: string | undefined) => {
    switch (status) {
        case 'PENDING':
            return 'Đang chờ';
        case 'REJECTED':
            return 'Bị từ chối';
        case 'CONFIRMED':
            return 'Đã xác nhận';
        case 'CANCELLED':
            return 'Đã hủy';
        case 'CHECKED_IN':
            return 'Đã đến';
        case 'COMPLETED':
            return 'Đã hoàn thành';
        case 'NO_SHOW':
            return 'Không đến';
        default:
            return status ?? '—';
    }
};

const translatePaymentStatus = (status: string | undefined) => {
    switch (status) {
        case 'UNPAID':
            return 'Chưa thanh toán';
        case 'PAID':
            return 'Đã thanh toán';
        case 'PARTIAL':
            return 'Thanh toán đặt cọc';
        case 'REFUNDED':
            return 'Đã hoàn tiền';
        default:
            return status ?? '—';
    }
};

function BookingSuccessPage() {
    const router = useRouter();
    const params = useParams();
    const searchParams = useSearchParams();

    const rawSlug = params?.slug ?? '';
    const slug = Array.isArray(rawSlug) ? rawSlug[0] : rawSlug;
    const bookingId = searchParams.get('bookingId') ?? '';

    const { data, isPending, isError, error } = useGetBooking(bookingId);

    const booking = useMemo(() => {
        const payload = data?.data;
        if (!payload) return null;
        return payload.booking ?? payload;
    }, [data]);

    const bookingDate = booking?.bookingDate ? formatDate(booking.bookingDate) : '—';
    const bookingTime = booking?.startTime ?? '—';
    const guestCount = booking?.guestCount ?? '—';
    const tableCount = booking?.tableIds?.length ?? '—';
    const contactName = booking?.contactName ?? '—';
    const contactPhone = booking?.contactPhone ?? '—';
    const bookingStatus = translateBookingStatus(booking?.status);
    const paymentStatus = translatePaymentStatus(booking?.paymentStatus);
    const depositAmount = booking?.pricingSnapshot?.depositAmount ?? booking?.depositAmount ?? 0;
    const totalAmount = booking?.pricingSnapshot?.finalPrice ?? booking?.depositAmount ?? 0;

    const handleBackToRestaurant = () => {
        if (slug) {
            router.push(`/discover/${slug}`);
            return;
        }

        router.push('/');
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
                            className="rounded-full bg-[#6f4e37] px-8 py-3"
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
                            className="rounded-full bg-[#6f4e37] px-8 py-3"
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
        <div className="flex items-center justify-center">
            <CustomCard className="w-full max-w-5xl p-6">
                <div className="space-y-4">
                    <h1 className="text-2xl font-semibold text-[#1f2937]">Đặt bàn thành công</h1>
                    <p className="text-sm text-gray-500">
                        Cảm ơn bạn đã đặt bàn. Dưới đây là thông tin chi tiết của booking.
                    </p>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    <div className="rounded-3xl border border-gray-200 bg-white p-4">
                        <p className="text-xs uppercase tracking-wide text-gray-500">Mã booking</p>
                        <p className="mt-2 text-lg font-semibold text-[#1f2937]">
                            {booking?._id ?? bookingId}
                        </p>
                    </div>
                    <div className="rounded-3xl border border-gray-200 bg-white p-4">
                        <p className="text-xs uppercase tracking-wide text-gray-500">Trạng thái</p>
                        <p className="mt-2 text-lg font-semibold text-[#1f2937]">{bookingStatus}</p>
                    </div>
                    <div className="rounded-3xl border border-gray-200 bg-white p-4">
                        <p className="text-xs uppercase tracking-wide text-gray-500">Thanh toán</p>
                        <p className="mt-2 text-lg font-semibold text-[#1f2937]">{paymentStatus}</p>
                    </div>
                    <div className="rounded-3xl border border-gray-200 bg-white p-4">
                        <p className="text-xs uppercase tracking-wide text-gray-500">Ngày đặt</p>
                        <p className="mt-2 text-lg font-semibold text-[#1f2937]">{bookingDate}</p>
                    </div>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    <div className="rounded-3xl border border-gray-200 bg-white p-4">
                        <p className="text-xs uppercase tracking-wide text-gray-500">Giờ</p>
                        <p className="mt-2 text-lg font-semibold text-[#1f2937]">{bookingTime}</p>
                    </div>
                    <div className="rounded-3xl border border-gray-200 bg-white p-4">
                        <p className="text-xs uppercase tracking-wide text-gray-500">Số khách</p>
                        <p className="mt-2 text-lg font-semibold text-[#1f2937]">{guestCount}</p>
                    </div>
                    <div className="rounded-3xl border border-gray-200 bg-white p-4">
                        <p className="text-xs uppercase tracking-wide text-gray-500">Số bàn</p>
                        <p className="mt-2 text-lg font-semibold text-[#1f2937]">{tableCount}</p>
                    </div>
                    <div className="rounded-3xl border border-gray-200 bg-white p-4">
                        <p className="text-xs uppercase tracking-wide text-gray-500">Tiền cọc</p>
                        <p className="mt-2 text-lg font-semibold text-[#1f2937]">
                            {depositAmount?.toLocaleString?.() ?? 0}đ
                        </p>
                    </div>
                    <div className="rounded-3xl border border-gray-200 bg-white p-4">
                        <p className="text-xs uppercase tracking-wide text-gray-500">Tổng tiền</p>
                        <p className="mt-2 text-lg font-semibold text-[#1f2937]">
                            {totalAmount?.toLocaleString?.() ?? 0}đ
                        </p>
                    </div>
                </div>

                <div className="mt-6 rounded-3xl border border-gray-200 bg-white p-6">
                    <h2 className="text-lg font-semibold text-[#1f2937]">Thông tin liên hệ</h2>
                    <div className="mt-4 space-y-3 text-sm text-gray-600">
                        <div className="flex justify-between">
                            <span>Người đặt</span>
                            <span>{contactName}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Điện thoại</span>
                            <span>{contactPhone}</span>
                        </div>
                    </div>
                </div>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                    <Button
                        type="button"
                        size="lg"
                        className="w-full rounded-full border border-gray-300 bg-white px-8 py-3 text-[#1f2937]"
                        onPress={() => router.back()}
                    >
                        Quay lại
                    </Button>
                    <Button
                        type="button"
                        size="lg"
                        className="w-full rounded-full bg-[#6f4e37] px-8 py-3"
                        onPress={handleBackToRestaurant}
                    >
                        Về trang chủ
                    </Button>
                </div>
            </CustomCard>
        </div>
    );
}

export default BookingSuccessPage;
