'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { Button, Separator, Spinner } from '@heroui/react';
import Image from 'next/image';

import CustomCard from '@/shared/components/card/CustomCard';
import CustomForm from '@/shared/components/form/CustomForm';
import InfoSectionCard from '@/features/booking/components/InfoSectionCard';
import InfoValueCard from '@/features/booking/components/InfoValueCard';
import { useGetRestaurantBySlug } from '@/features/restaurant/hooks/useGetRestaurant';

import { useCreateBooking, usePreviewBookingPricing } from '../../hook/useBooking';
import { bookingFormFields } from '../../constants/booking-form-field';
import { CreateBookingPayload } from '../../types/booking.dto';

export default function BookingTablePage() {
    const router = useRouter();
    const params = useParams();
    const searchParams = useSearchParams();

    const rawSlug = params?.slug ?? searchParams.get('slug') ?? '';
    const slug = Array.isArray(rawSlug) ? rawSlug[0] : String(rawSlug);

    const { data: restaurant, isPending } = useGetRestaurantBySlug(slug);

    const tableIdsQuery = searchParams.get('tables') ?? '';
    const bookingDate = searchParams.get('bookingDate') ?? '';
    const startTime = searchParams.get('startTime') ?? '';
    const guestCount = Number(searchParams.get('guestCount') ?? 1);

    const tableIds = useMemo(
        () => (tableIdsQuery ? tableIdsQuery.split(',') : []),
        [tableIdsQuery]
    );

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
            router.push(`/discover/${slug}/booking/checkout/${data.data.booking._id}`);
        } else {
            router.push(`/discover/${slug}/booking/success/${data.data.booking._id}`);
        }
    };

    if (isPending) {
        return (
            <div className="flex h-full items-center justify-center">
                <Spinner />
            </div>
        );
    }

    return (
        <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-6 md:grid-cols-3">
            <div className="col-span-2 space-y-6">
                <CustomCard>
                    <h2 className="text-2xl font-semibold text-[#1f2937]">
                        Chi tiết thông tin khách hàng
                    </h2>

                    <p className="text-sm text-gray-500">
                        Vui lòng điền thông tin bên dưới để chúng tôi có thể liên hệ bạn.
                    </p>

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

            <aside>
                <CustomCard>
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

                    <div className="mt-4">
                        <h3 className="text-lg font-semibold">{restaurant?.restaurantName}</h3>

                        {restaurant?.address && (
                            <p className="text-sm text-gray-500">{restaurant.address}</p>
                        )}
                    </div>

                    <div className="mt-4 grid gap-3">
                        <InfoValueCard label="NGÀY ĐẶT" value={bookingDate || '—'} />
                        <InfoValueCard label="GIỜ ĐẶT" value={startTime || '—'} />
                        <InfoValueCard label="SỐ LƯỢNG KHÁCH" value={`${guestCount} Người`} />
                        <InfoValueCard label="SỐ BÀN" value={`${tableIds.length} Bàn`} />
                    </div>

                    <Separator className="my-4" />

                    <InfoSectionCard title="Tóm tắt giá dự kiến">
                        {isPreviewing ? (
                            <div className="mt-3 flex items-center gap-2 text-sm text-gray-500">
                                <Spinner size="sm" />
                                Đang tính giá...
                            </div>
                        ) : previewData ? (
                            <div className="mt-3 space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Giá cơ bản</span>

                                    <span className="font-semibold">
                                        {previewData.basePrice?.toLocaleString() ?? 0}đ
                                    </span>
                                </div>

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

                                <div className="flex justify-between">
                                    <span className="text-gray-500">Phí giữ chỗ</span>

                                    <span className="font-semibold">
                                        {previewData.depositAmount?.toLocaleString() ?? 0}đ
                                    </span>
                                </div>

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
                    </InfoSectionCard>
                </CustomCard>
            </aside>
        </div>
    );
}
