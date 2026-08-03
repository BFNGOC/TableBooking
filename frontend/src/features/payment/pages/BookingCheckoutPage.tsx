'use client';

import { useMemo, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { Button, Spinner } from '@heroui/react';
import CustomCard from '@/shared/components/card/CustomCard';
import CustomForm from '@/shared/components/form/CustomForm';
import { FormField } from '@/shared/types/form-field';
import { FormFieldType } from '@/shared/types/form-field-types';
import { useGetBooking } from '@/features/booking/hook/useBookingMe';
import { useCreatePayment } from '../hook/useCreatePayment';
import { PaymentMethod, PaymentType } from '../types/payment.type';

function BookingCheckoutPage() {
    const router = useRouter();
    const params = useParams();
    const searchParams = useSearchParams();

    const rawSlug = params?.slug ?? '';
    const slug = Array.isArray(rawSlug) ? rawSlug[0] : String(rawSlug);
    const bookingId = searchParams.get('bookingId') ?? '';

    const { data, isPending, isError, error } = useGetBooking(bookingId);

    const booking = useMemo(() => {
        const payload = data?.data;

        if (!payload) return null;
        return payload.booking ?? payload;
    }, [data]);

    const bookingDate = booking?.bookingDate ? String(booking.bookingDate).slice(0, 10) : '—';
    const bookingTime = booking?.startTime ?? '—';
    const guestCount = booking?.guestCount ?? '—';
    const tableCount = booking?.tableIds?.length ?? '—';
    const contactName = booking?.contactName ?? '—';
    const contactPhone = booking?.contactPhone ?? '—';
    const note = booking?.restaurantNote ?? '—';
    const depositAmount = booking?.pricingSnapshot?.depositAmount ?? booking?.depositAmount ?? 0;
    const totalAmount = booking?.pricingSnapshot?.finalPrice ?? booking?.depositAmount ?? 0;

    const [paymentFormValues, setPaymentFormValues] = useState({
        paymentMethod: PaymentMethod.VNPAY,
        paymentType: PaymentType.DEPOSIT,
    });
    const createPaymentMutation = useCreatePayment();

    const paymentFormFields: FormField[] = [
        {
            name: 'paymentMethod',
            label: 'Hình thức',
            type: FormFieldType.SELECT,
            isRequired: true,
            col: 6,
            options: [
                { id: PaymentMethod.VNPAY, text: 'VNPAY' },
                { id: PaymentMethod.MOMO, text: 'MOMO' },
                { id: PaymentMethod.CASH, text: 'Tiền mặt' },
            ],
        },
        {
            name: 'paymentType',
            label: 'Loại thanh toán',
            type: FormFieldType.SELECT,
            isRequired: true,
            col: 6,
            options: [
                { id: PaymentType.DEPOSIT, text: 'Cọc' },
                { id: PaymentType.FULL, text: 'Thanh toán đầy đủ' },
            ],
        },
    ];

    const handleCreatePayment = async () => {
        if (!booking?._id || !booking?.restaurantId) return;

        const result = await createPaymentMutation.mutateAsync({
            restaurantId: booking.restaurantId,
            body: {
                bookingId: booking._id,
                type: paymentFormValues.paymentType,
                method: paymentFormValues.paymentMethod,
            },
        });

        console.log('Payment creation result:', result);

        const paymentUrl = result?.data?.paymentUrl ?? booking?.paymentUrl;

        if (paymentUrl) {
            window.location.href = paymentUrl;
        }
    };

    const handleBack = () => {
        const params = new URLSearchParams();

        if (booking?.tableIds?.length > 0) {
            params.set('tables', booking.tableIds.join(','));
        }
        if (booking?.bookingDate) {
            params.set('bookingDate', String(booking.bookingDate).slice(0, 10));
        }
        if (booking?.startTime) {
            params.set('startTime', booking.startTime);
        }
        if (booking?.guestCount) {
            params.set('guestCount', String(booking.guestCount));
        }

        router.push(`/discover/${slug}?${params.toString()}`);
    };

    if (!bookingId) {
        return (
            <div className="flex h-full items-center justify-center p-8">
                <CustomCard className="max-w-3xl mx-auto p-6 text-center">
                    <h2 className="text-xl font-semibold">Không tìm thấy thông tin thanh toán</h2>
                    <p className="mt-2 text-sm text-gray-500">
                        Booking ID không tồn tại. Vui lòng kiểm tra lại liên kết hoặc quay lại trang
                        trước.
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
                    <h2 className="text-xl font-semibold">Lỗi tải đơn đặt bàn</h2>
                    <p className="mt-2 text-sm text-gray-500">
                        {String(error?.message ?? 'Đã xảy ra lỗi khi tải thông tin thanh toán.')}
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
        <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-8 md:grid-cols-3">
            <div className="col-span-2 space-y-6">
                <CustomCard>
                    <div className="space-y-4">
                        <h2 className="text-2xl font-semibold text-[#1f2937]">
                            Thanh toán đặt bàn
                        </h2>
                        <p className="text-sm text-gray-500">
                            Xem lại thông tin đặt bàn và thanh toán cọc nếu cần.
                        </p>
                    </div>

                    <div className="mt-6 grid gap-4 sm:grid-cols-2">
                        <div className="rounded-3xl border border-gray-200 bg-white p-4">
                            <p className="text-xs uppercase tracking-wide text-gray-500">
                                Ngày đặt
                            </p>
                            <p className="mt-2 text-lg font-semibold text-[#1f2937]">
                                {bookingDate}
                            </p>
                        </div>
                        <div className="rounded-3xl border border-gray-200 bg-white p-4">
                            <p className="text-xs uppercase tracking-wide text-gray-500">Giờ</p>
                            <p className="mt-2 text-lg font-semibold text-[#1f2937]">
                                {bookingTime}
                            </p>
                        </div>
                        <div className="rounded-3xl border border-gray-200 bg-white p-4">
                            <p className="text-xs uppercase tracking-wide text-gray-500">
                                Số khách
                            </p>
                            <p className="mt-2 text-lg font-semibold text-[#1f2937]">
                                {guestCount}
                            </p>
                        </div>
                        <div className="rounded-3xl border border-gray-200 bg-white p-4">
                            <p className="text-xs uppercase tracking-wide text-gray-500">Số bàn</p>
                            <p className="mt-2 text-lg font-semibold text-[#1f2937]">
                                {tableCount}
                            </p>
                        </div>
                    </div>

                    <div className="mt-6 rounded-3xl border border-gray-200 bg-white p-6">
                        <h3 className="text-lg font-semibold text-[#1f2937]">Thông tin liên hệ</h3>
                        <div className="mt-4 space-y-3 text-sm text-gray-600">
                            <div className="flex justify-between">
                                <span>Người đặt</span>
                                <span>{contactName}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Điện thoại</span>
                                <span>{contactPhone}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Ghi chú</span>
                                <span>{note}</span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 rounded-3xl border border-gray-200 bg-white p-6">
                        <h3 className="text-lg font-semibold text-[#1f2937]">Tóm tắt thanh toán</h3>
                        <div className="mt-4 space-y-3 text-sm text-gray-600">
                            <div className="flex justify-between">
                                <span>Tiền cọc</span>
                                <span>{depositAmount?.toLocaleString?.() ?? 0}đ</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Tổng dự kiến</span>
                                <span>{totalAmount?.toLocaleString?.() ?? 0}đ</span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 rounded-3xl border border-gray-200 bg-white p-6">
                        <h3 className="text-lg font-semibold text-[#1f2937]">Chọn thanh toán</h3>
                        <div className="mt-4">
                            <CustomForm
                                values={paymentFormValues}
                                fields={paymentFormFields}
                                onValuesChange={(values) =>
                                    setPaymentFormValues((prev) => ({
                                        ...prev,
                                        ...values,
                                    }))
                                }
                                renderForm={false}
                            />
                        </div>
                    </div>

                    <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                        <Button
                            type="button"
                            size="lg"
                            className="w-full rounded-full bg-[#6f4e37] px-8 py-3"
                            onPress={handleBack}
                        >
                            Quay lại
                        </Button>
                        <Button
                            type="button"
                            size="lg"
                            className="w-full rounded-full border border-gray-300 bg-white px-8 py-3 text-[#1f2937]"
                            onPress={handleCreatePayment}
                            isPending={createPaymentMutation.isPending}
                        >
                            {createPaymentMutation.isPending ? 'Đang tạo...' : 'Thanh toán ngay'}
                        </Button>
                    </div>
                </CustomCard>
            </div>

            <aside>
                <CustomCard headerTitle="Chi tiết Booking">
                    <div className="space-y-3 text-sm text-gray-600">
                        <div className="flex justify-between">
                            <span>ID Booking</span>
                            <span>{booking?._id ?? bookingId}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Trạng thái</span>
                            <span>{booking?.status ?? '—'}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Thanh toán</span>
                            <span>{booking?.paymentStatus ?? '—'}</span>
                        </div>
                    </div>
                </CustomCard>
            </aside>
        </div>
    );
}

export default BookingCheckoutPage;
