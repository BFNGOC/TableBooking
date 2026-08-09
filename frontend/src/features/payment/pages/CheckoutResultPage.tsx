'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Button, Spinner } from '@heroui/react';
import CustomCard from '@/shared/components/card/CustomCard';
import InfoSectionCard from '@/features/booking/components/InfoSectionCard';
import InfoValueCard from '@/features/booking/components/InfoValueCard';
import { useGetPaymentMe } from '@/features/payment/hook/usePaymentMe';
import {
    translatePaymentStatus,
    translatePaymentType,
} from '@/features/booking/utils/booking-status';

interface CheckoutResultProps {
    id: string;
}

const renderValue = (value: unknown) => {
    if (value === null || value === undefined) {
        return '—';
    }

    if (typeof value === 'object') {
        try {
            return JSON.stringify(value);
        } catch {
            return '—';
        }
    }

    return String(value);
};

const getBookingId = (payment: any, queryBookingId: string) => {
    const rawBookingId = payment?.booking?._id ?? payment?.bookingId._id ?? queryBookingId ?? '';

    if (typeof rawBookingId === 'string') {
        return rawBookingId;
    }

    if (rawBookingId && typeof rawBookingId === 'object' && '_id' in rawBookingId) {
        return String(rawBookingId._id);
    }

    return String(rawBookingId);
};

function CheckoutResultPage({ id }: CheckoutResultProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const { data, isPending, isError, error } = useGetPaymentMe(id);
    const payment = data?.data;

    const slug = payment?.restaurantId?.slug ?? '';
    const queryBookingId = searchParams.get('bookingId') ?? '';
    const bookingId = getBookingId(payment, queryBookingId);

    console.log(slug);

    const successLink = slug && bookingId ? `/discover/${slug}/booking/success/${bookingId}` : '';

    const paymentStatus = translatePaymentStatus(payment?.status);
    const paymentMethod = renderValue(payment?.method ?? '—');
    const paymentType = translatePaymentType(payment?.type);

    const handleGoSuccess = () => {
        if (!successLink) return;
        router.push(successLink);
    };

    if (isPending) {
        return (
            <div className="flex h-full items-center justify-center">
                <Spinner />
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex h-full items-center justify-center">
                <CustomCard className="max-w-3xl mx-auto p-6 text-center">
                    <h2 className="text-xl font-semibold">Lỗi tải kết quả thanh toán</h2>
                    <p className="mt-2 text-sm text-gray-500">
                        {String(error?.message ?? 'Đã xảy ra lỗi khi lấy thông tin thanh toán.')}
                    </p>
                    <div className="mt-6">
                        <Button
                            type="button"
                            className="rounded-full bg-[#6f4e37] px-8 py-3"
                            onPress={() => router.back()}
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
            <CustomCard>
                <div className="space-y-4">
                    <h1 className="text-2xl font-semibold text-[#1f2937]">Kết quả thanh toán</h1>
                    <p className="text-sm text-gray-500">
                        Thanh toán được lấy từ ID giao dịch: <strong>{id}</strong>
                    </p>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    <InfoValueCard label="Booking ID" value={bookingId || 'Không có thông tin'} />
                    <InfoValueCard label="Trạng thái" value={paymentStatus} />
                    <InfoValueCard label="Hình thức" value={paymentMethod} />
                    <InfoValueCard label="Loại thanh toán" value={paymentType} />
                </div>

                <InfoSectionCard title="Thông tin chi tiết" className="mt-6">
                    <div className="mt-4 space-y-3 text-sm text-gray-600">
                        <div className="flex justify-between">
                            <span>ID thanh toán</span>
                            <span>{payment?._id ?? '—'}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Booking</span>
                            <span>{renderValue(payment?.bookingId?._id)}</span>
                        </div>

                        <div className="flex justify-between">
                            <span>Số tiền</span>
                            <span>{renderValue(payment?.amount)}</span>
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
                        onPress={handleGoSuccess}
                        isDisabled={!successLink}
                    >
                        {successLink
                            ? 'Xem trạng thái thành công'
                            : 'Không có đường dẫn thành công'}
                    </Button>
                </div>
            </CustomCard>
        </div>
    );
}

export default CheckoutResultPage;
