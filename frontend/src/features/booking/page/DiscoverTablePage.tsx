'use client';

import { useState } from 'react';
import { Button, Spinner } from '@heroui/react';

import { useGetRestaurantBySlug } from '@/features/restaurant/hooks/useGetRestaurant';
import CustomForm from '@/shared/components/form/CustomForm';
import CustomCard from '@/shared/components/card/CustomCard';
import { GetAvailableTablesPayload } from '../types/booking.dto';
import { availableTableFormField } from '../constants/availabe-table-form-field';
import { useGetAvailableTables } from '../hook/useAvailableTables';
import { ITableDetail } from '../types/booking-response';
import { formatFormValues } from '@/shared/utils/format-form-values';

interface DiscoverTablePageProps {
    slug: string;
}

function DiscoverTablePage({ slug }: DiscoverTablePageProps) {
    const { data: restaurant, isPending } = useGetRestaurantBySlug(slug);

    // Giá trị form hiện tại
    const [filterValues, setFilterValues] = useState<GetAvailableTablesPayload>({
        date: '',
        startTime: '',
        guestCount: 1,
    });

    // Params dùng để search API
    const [searchParams, setSearchParams] = useState<GetAvailableTablesPayload>();

    const [selectedTable, setSelectedTable] = useState<ITableDetail | null>(null);

    console.log(selectedTable);

    const {
        data: availableTablesResponse,
        isFetching: isFetchingAvailableTables,
        isFetched: hasFetchedAvailableTables,
    } = useGetAvailableTables(restaurant?._id ?? '', searchParams);

    const availableTables = availableTablesResponse?.data;
    const tableAreas = availableTables?.areas ?? [];

    const handleSearchTables = () => {
        const payload = formatFormValues(filterValues, availableTableFormField, 'toApi');

        const dateValue = payload.date;

        const date =
            dateValue &&
            typeof dateValue === 'object' &&
            'year' in dateValue &&
            'month' in dateValue &&
            'day' in dateValue
                ? `${dateValue.year}-${String(dateValue.month).padStart(2, '0')}-${String(
                      dateValue.day
                  ).padStart(2, '0')}`
                : String(dateValue);

        const params: GetAvailableTablesPayload = {
            date,
            startTime: payload.startTime as string,
            guestCount: Number(payload.guestCount),
        };

        console.log('params gửi API:', params);

        setSelectedTable(null);
        setSearchParams(params);
    };

    const renderStatusLabel = (status: string) => {
        switch (status) {
            case 'AVAILABLE':
                return (
                    <span className="rounded-full bg-[#d9ead3] px-2 py-1 text-[10px] font-semibold text-[#386641]">
                        Trống
                    </span>
                );
            case 'RESERVED':
                return (
                    <span className="rounded-full bg-[#ebdcd5] px-2 py-1 text-[10px] font-semibold text-[#7a4f36]">
                        Đã đặt
                    </span>
                );
            default:
                return (
                    <span className="rounded-full bg-[#f2e0d6] px-2 py-1 text-[10px] font-semibold text-[#7a4f36]">
                        Đang sử dụng
                    </span>
                );
        }
    };

    if (isPending) {
        return (
            <div className="flex h-full items-center justify-center">
                <Spinner />
            </div>
        );
    }

    if (!restaurant) {
        return (
            <div className="flex h-full items-center justify-center">Không tìm thấy nhà hàng</div>
        );
    }

    const selectedAreaName = selectedTable
        ? tableAreas.find((area: { area: { name: string; _id: string }; tables: ITableDetail[] }) =>
              area.tables.some((table: ITableDetail) => table._id === selectedTable._id)
          )?.area.name
        : undefined;

    return (
        <div className="flex flex-col gap-4 relative">
            <CustomCard>
                <div className="flex flex-col gap-4">
                    <div>
                        <h1 className="text-2xl font-bold">{restaurant.restaurantName}</h1>

                        {restaurant.address && (
                            <p className="mt-1 text-sm text-gray-500">{restaurant.address}</p>
                        )}
                    </div>

                    <div className="flex flex-wrap gap-6 text-sm">
                        {restaurant.phone && (
                            <div>
                                <span className="font-medium">Số điện thoại:</span>{' '}
                                {restaurant.phone}
                            </div>
                        )}

                        {restaurant.rating !== undefined && (
                            <div>
                                <span className="font-medium">Đánh giá:</span> ⭐{' '}
                                {restaurant.rating}
                            </div>
                        )}

                        {(restaurant.priceFrom !== undefined ||
                            restaurant.priceTo !== undefined) && (
                            <div>
                                <span className="font-medium">Mức giá:</span>{' '}
                                {restaurant.priceFrom?.toLocaleString()} -{' '}
                                {restaurant.priceTo?.toLocaleString()}
                            </div>
                        )}
                    </div>
                </div>
            </CustomCard>

            <CustomCard>
                <CustomForm<GetAvailableTablesPayload>
                    fields={availableTableFormField}
                    values={filterValues}
                    onValuesChange={(values) =>
                        setFilterValues((prev) => ({
                            ...prev,
                            ...values,
                        }))
                    }
                    onSubmit={handleSearchTables}
                    footer={
                        <Button
                            type="submit"
                            className="bg-[#6f4e37]"
                            size="lg"
                            isPending={isFetchingAvailableTables}
                        >
                            Tìm bàn ngay
                        </Button>
                    }
                    footerClassName="col-span-3 items-center justify-center"
                />
            </CustomCard>

            {(isFetchingAvailableTables || hasFetchedAvailableTables) && (
                <CustomCard className="space-y-4">
                    <div>
                        <div className="mb-4 flex flex-col gap-2">
                            <h2 className="text-xl font-semibold">Chọn vị trí yêu thích</h2>
                            <p className="text-sm text-gray-500">
                                Chọn bàn phù hợp với nhu cầu của bạn. Không cần sơ đồ mặt bằng.
                            </p>
                        </div>

                        {tableAreas.length === 0 ? (
                            <div className="rounded-3xl border border-dashed border-gray-300 p-8 text-center text-sm text-gray-500">
                                Không có bàn phù hợp trong thời gian này.
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {tableAreas.map(
                                    (area: {
                                        area: { name: string; _id: string };
                                        tables: ITableDetail[];
                                    }) => (
                                        <div
                                            key={area.area._id}
                                            className="rounded-3xl border border-[#e5ddd6] bg-white p-4"
                                        >
                                            <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                                <div>
                                                    <p className="text-sm uppercase tracking-[0.2em] text-[#7a4f36]">
                                                        Khu vực
                                                    </p>
                                                    <h3 className="text-lg font-semibold">
                                                        {area.area.name}
                                                    </h3>
                                                </div>
                                                <p className="text-sm text-gray-500">
                                                    {area.tables.length} bàn
                                                </p>
                                            </div>

                                            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                                                {area.tables.map((table: ITableDetail) => {
                                                    const isAvailable =
                                                        table.status === 'AVAILABLE';

                                                    return (
                                                        <button
                                                            key={table._id}
                                                            type="button"
                                                            onClick={() => {
                                                                if (!isAvailable) return;
                                                                setSelectedTable(table);
                                                            }}
                                                            disabled={!isAvailable}
                                                            className={`group rounded-3xl border p-4 text-left transition duration-200 ${
                                                                selectedTable?._id === table._id
                                                                    ? 'border-[#6f4e37] bg-[#f8efe8]'
                                                                    : 'border-transparent bg-white hover:border-[#6f4e37] hover:bg-[#f5efeb]'
                                                            } ${!isAvailable ? 'cursor-not-allowed opacity-60' : ''}`}
                                                        >
                                                            <div className="flex items-center justify-between">
                                                                <div>
                                                                    <p className="text-base font-semibold">
                                                                        Bàn {table.tableNumber}
                                                                    </p>
                                                                    <p className="text-sm text-gray-500">
                                                                        {table.capacity} người
                                                                    </p>
                                                                </div>
                                                                {renderStatusLabel(table.status)}
                                                            </div>
                                                            {table.description && (
                                                                <p className="mt-3 text-sm text-gray-500">
                                                                    {table.description}
                                                                </p>
                                                            )}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )
                                )}
                            </div>
                        )}
                    </div>
                </CustomCard>
            )}

            <div className="fixed bottom-0 left-0 right-0 z-50 px-3 pb-3 sm:px-6 sm:pb-4">
                <div className="mx-auto flex max-w-7xl items-center gap-4 rounded-[28px] bg-[#6f4e37] px-5 py-3 text-white shadow-2xl sm:px-7">
                    {/* Icon */}
                    <div className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/10 sm:flex">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            className="h-5 w-5"
                        >
                            <path d="M4 10h16" />
                            <path d="M6 10v8" />
                            <path d="M18 10v8" />
                            <path d="M4 18h16" />
                            <path d="M8 10V6h8v4" />
                        </svg>
                    </div>

                    {/* Thông tin bàn */}
                    <div className="min-w-0 flex-1">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#d8c2b5]">
                            Bàn đã chọn
                        </p>

                        {selectedTable ? (
                            <div className="mt-0.5">
                                <p className="truncate text-base font-bold sm:text-lg">
                                    Bàn số {selectedTable.tableNumber}
                                    {selectedAreaName && ` — Khu vực ${selectedAreaName}`}
                                </p>

                                <p className="text-xs text-[#f7ede2] sm:text-sm">
                                    {selectedTable.capacity} người
                                </p>
                            </div>
                        ) : (
                            <p className="mt-1 text-sm text-[#f7ede2]">Chưa có bàn được chọn</p>
                        )}
                    </div>

                    {/* Thông tin booking */}
                    {selectedTable && (
                        <div className="hidden shrink-0 text-right md:block">
                            <p className="text-xs text-[#d8c2b5]">
                                {availableTables?.date}, {availableTables?.startTime}
                            </p>

                            <p className="text-sm font-semibold">
                                Phí giữ chỗ: {selectedTable.depositAmount?.toLocaleString()}đ
                            </p>
                        </div>
                    )}

                    {/* Button */}
                    <Button
                        type="button"
                        size="lg"
                        isDisabled={!selectedTable}
                        className="shrink-0 rounded-full bg-white px-6 font-semibold text-[#6f4e37] shadow-sm hover:bg-[#f3e8e0] disabled:opacity-50 sm:px-8"
                    >
                        <span>Tiếp tục điền thông tin</span>

                        <span className="ml-2 text-xl leading-none">→</span>
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default DiscoverTablePage;
