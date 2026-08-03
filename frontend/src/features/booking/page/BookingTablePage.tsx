'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { Button, Spinner } from '@heroui/react';
import Image from 'next/image';

import CustomCard from '@/shared/components/card/CustomCard';
import CustomForm from '@/shared/components/form/CustomForm';
import { useGetRestaurantBySlug } from '@/features/restaurant/hooks/useGetRestaurant';

import { useCreateBooking, usePreviewBookingPricing } from '../hook/usebooking';
import { bookingFormFields } from '../constants/booking-form-field';
import { CreateBookingPayload } from '../types/booking.dto';

export default function BookingTablePage() {
    const router = useRouter();
    const params = useParams();
    const searchParams = useSearchParams();

    const rawSlug = params?.slug ?? searchParams.get('slug') ?? '';
    const slug = Array.isArray(rawSlug) ? rawSlug[0] : String(rawSlug);

    const { data: restaurant, isPending } = useGetRestaurantBySlug(slug);

    /**
     * =========================
     * Booking data from URL
     * =========================
     */
    const tableIdsQuery = searchParams.get('tables') ?? '';
    const bookingDate = searchParams.get('bookingDate') ?? '';
    const startTime = searchParams.get('startTime') ?? '';
    const guestCount = Number(searchParams.get('guestCount') ?? 1);

    const tableIds = useMemo(
        () => (tableIdsQuery ? tableIdsQuery.split(',') : []),
        [tableIdsQuery]
    );

    /**
     * =========================
     * Mutations
     * =========================
     */
    const previewMutation = usePreviewBookingPricing();
    const createMutation = useCreateBooking();

    const [bookingFormValues, setBookingFormValues] = useState<Partial<Record<string, any>>>({
        contactName: '',
        contactPhone: '',
        restaurantNote: '',
        payDepositNow: false,
    });

    const previewData = previewMutation.data?.data;
    const isPreviewing = previewMutation.isPending;

    /**
     * =========================
     * Preview booking pricing
     *
     * Chỉ gọi lại khi booking data
     * trong URL thay đổi.
     * =========================
     */
    useEffect(() => {
        if (!restaurant?._id) return;
        if (!tableIdsQuery) return;
        if (tableIds.length === 0) return;
        if (!bookingDate) return;
        if (!startTime) return;

        previewMutation.mutate({
            restaurantId: restaurant._id,
            body: {
                bookingDate,
                startTime,
                tableIds,
            },
        });
    }, [restaurant?._id, tableIdsQuery, bookingDate, startTime]);

    const handleSubmit = async (values: Partial<Record<string, any>>) => {
        if (!restaurant?._id) return;

        const payload: CreateBookingPayload = {
            bookingDate,
            startTime,
            guestCount,
            tableIds,

            contactName: values.contactName,
            contactPhone: values.contactPhone,
            restaurantNote: values.restaurantNote,

            payDepositNow: values.payDepositNow ?? false,
        };

        const data = await createMutation.mutateAsync({
            restaurantId: restaurant._id,
            body: payload,
        });

        if (data.data.payDepositNow) {
            router.push(`/discover/${slug}/booking/payment?bookingId=${data.data.booking._id}`);
        } else {
            router.push(`/discover/${slug}/booking/success?bookingId=${data.data.booking._id}`);
        }
    };

    /**
     * =========================
     * Loading
     * =========================
     */
    if (isPending) {
        return (
            <div className="flex h-full items-center justify-center">
                <Spinner />
            </div>
        );
    }

    return (
        <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-6 md:grid-cols-3">
            {/* =========================
                Customer information
            ========================== */}
            <div className="col-span-2 space-y-6">
                <CustomCard>
                    <h2 className="text-2xl font-semibold text-[#1f2937]">
                        Chi tiết thông tin khách hàng
                    </h2>

                    <p className="text-sm text-gray-500">
                        Vui lòng điền thông tin bên dưới để chúng tôi có thể liên hệ bạn.
                    </p>

                    {/* =========================
                        Customer form
                    ========================== */}
                    <div className="mt-6">
                        <CustomForm
                            values={bookingFormValues}
                            fields={bookingFormFields}
                            onValuesChange={setBookingFormValues}
                            onSubmit={handleSubmit}
                            footer={
                                <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
                                    <Button
                                        type="button"
                                        size="lg"
                                        className="w-full rounded-full border bg-white px-8 py-3 text-[#6f4e37]"
                                        onPress={() => router.back()}
                                        isPending={createMutation.isPending}
                                    >
                                        Quay lại
                                    </Button>
                                    <Button
                                        type="submit"
                                        size="lg"
                                        className="rounded-full bg-[#6f4e37] px-8 py-3"
                                        isPending={createMutation.isPending}
                                    >
                                        Xác nhận đặt bàn
                                    </Button>
                                </div>
                            }
                        />
                    </div>
                </CustomCard>
            </div>

            {/* =========================
                Booking summary
            ========================== */}
            <aside>
                <CustomCard>
                    {/* Restaurant image */}
                    <div className="relative h-40 w-full overflow-hidden rounded-xl">
                        <Image
                            src={restaurant?.avatar?.url ?? '/assets/images/default-restaurant.jpg'}
                            alt={String(restaurant?.restaurantName ?? '')}
                            fill
                            style={{
                                objectFit: 'cover',
                            }}
                        />
                    </div>

                    {/* Restaurant info */}
                    <div className="mt-4">
                        <h3 className="text-lg font-semibold">{restaurant?.restaurantName}</h3>

                        {restaurant?.address && (
                            <p className="text-sm text-gray-500">{restaurant.address}</p>
                        )}
                    </div>

                    {/* Booking summary */}
                    <div className="mt-4 space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="text-xs text-gray-500">NGÀY ĐẶT</div>

                            <div className="text-sm font-semibold">{bookingDate || '—'}</div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="text-xs text-gray-500">GIỜ ĐẶT</div>

                            <div className="text-sm font-semibold">{startTime || '—'}</div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="text-xs text-gray-500">SỐ LƯỢNG KHÁCH</div>

                            <div className="text-sm font-semibold">{guestCount} Người</div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="text-xs text-gray-500">SỐ BÀN</div>

                            <div className="text-sm font-semibold">{tableIds.length} Bàn</div>
                        </div>
                    </div>

                    {/* =========================
                        Pricing preview
                    ========================== */}
                    <div className="mt-6 border-t pt-4">
                        <h4 className="text-sm font-semibold text-gray-700">Tóm tắt giá dự kiến</h4>

                        {isPreviewing ? (
                            <div className="mt-3 flex items-center gap-2 text-sm text-gray-500">
                                <Spinner size="sm" />
                                Đang tính giá...
                            </div>
                        ) : previewData ? (
                            <div className="mt-3 space-y-2 text-sm">
                                {/* Base price */}
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Giá cơ bản</span>

                                    <span className="font-semibold">
                                        {previewData.basePrice?.toLocaleString() ?? 0}đ
                                    </span>
                                </div>

                                {/* Adjustments */}
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Khuyến mãi / điều chỉnh</span>

                                    <span className="font-semibold">
                                        {(
                                            previewData.adjustments?.reduce(
                                                (
                                                    sum: number,
                                                    adjustment: {
                                                        amount?: number;
                                                    }
                                                ) => sum + (adjustment.amount ?? 0),
                                                0
                                            ) ?? 0
                                        ).toLocaleString()}
                                        đ
                                    </span>
                                </div>

                                {/* Deposit */}
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Phí giữ chỗ</span>

                                    <span className="font-semibold">
                                        {previewData.depositAmount?.toLocaleString() ?? 0}đ
                                    </span>
                                </div>

                                {/* Final price */}
                                <div className="mt-2 flex justify-between border-t pt-2">
                                    <span className="font-semibold">Tổng</span>

                                    <span className="font-bold">
                                        {previewData.finalPrice?.toLocaleString() ?? 0}đ
                                    </span>
                                </div>
                            </div>
                        ) : (
                            <div className="mt-3 text-sm text-gray-500">Chưa có dữ liệu giá.</div>
                        )}
                    </div>
                </CustomCard>
            </aside>
        </div>
    );
}
