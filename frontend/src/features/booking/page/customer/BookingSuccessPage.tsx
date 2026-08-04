'use client';

import { useMemo } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { Button, Spinner } from '@heroui/react';
import CustomCard from '@/shared/components/card/CustomCard';
import InfoSectionCard from '@/features/booking/components/InfoSectionCard';
import InfoValueCard from '@/features/booking/components/InfoValueCard';
import { useGetBookingDetail } from '@/features/booking/hook/useBookingMe';
import { formatDate } from '@/shared/utils/date';
import { translateBookingStatus, translatePaymentStatus } from '../../utils/booking-status';

function BookingSuccessPage() {
    const router = useRouter();
    const params = useParams();
    const searchParams = useSearchParams();

    const rawSlug = params?.slug ?? '';
    const slug = Array.isArray(rawSlug) ? rawSlug[0] : rawSlug;
    const bookingId = searchParams.get('bookingId') ?? '';

    const { data, isPending, isError, error } = useGetBookingDetail(bookingId);

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
                    <InfoValueCard label="Mã booking" value={booking?._id ?? bookingId} />
                    <InfoValueCard label="Trạng thái" value={bookingStatus} />
                    <InfoValueCard label="Thanh toán" value={paymentStatus} />
                    <InfoValueCard label="Ngày đặt" value={bookingDate} />
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    <InfoValueCard label="Giờ" value={bookingTime} />
                    <InfoValueCard label="Số khách" value={guestCount} />
                    <InfoValueCard label="Số bàn" value={tableCount} />
                    <InfoValueCard
                        label="Tiền cọc"
                        value={`${depositAmount?.toLocaleString?.() ?? 0}đ`}
                    />
                    <InfoValueCard
                        label="Tổng tiền"
                        value={`${totalAmount?.toLocaleString?.() ?? 0}đ`}
                    />
                </div>

                <InfoSectionCard title="Thông tin liên hệ" className="mt-6">
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
                </InfoSectionCard>

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
