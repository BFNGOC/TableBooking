'use client';

import PageHeader from '@/shared/components/layouts/PageHeader';
import useTable from '@/shared/hooks/useTable';
import { BookingRestaurantParams } from '../../types/booking-restaurant-filter-params-type';
import { IBooking } from '../../types/booking.type';
import { bookingRoleRestaurantApi } from '../../api/booking-api';
import { useFormModal } from '@/shared/hooks/useFormModal';
import TablePaginationCustom, {
    ColumnTable,
} from '@/shared/components/table/TablePaginationCustom';
import ModalFormTabs from '@/shared/components/modals/ModalFormTabs';
import { DEFAULT_PAGINATION } from '@/shared/constants/default-pagination';
import TableFilterCustom from '@/shared/components/table/TableFilterCustom';
import { Button } from '@heroui/react';
import { bookingQueryKeys } from '../../constants/query-key';

function BookingsRestaurantPage() {
    const { getAll } = bookingRoleRestaurantApi;
    const { open, openView, close, selectedRecord } = useFormModal<IBooking>();

    const bookingRestaurantTable = useTable<IBooking, BookingRestaurantParams>({
        queryKey: bookingQueryKeys.GET_BOOKING_LIST_RESTAURANT,
        fetchApi: getAll,
    });

    console.log('bookingRestaurantTable.data', bookingRestaurantTable.data);

    const bookingColumns: ColumnTable[] = [
        { id: '_id', name: 'Booking Id' },
        { id: 'contactName', name: 'Tên nhà hàng' },
        { id: 'taxCode', name: 'Mã số thuế' },
        // {
        //     id: 'verifyStatus',
        //     name: 'Trạng thái',
        //     render: (value) => <VerifyStatus status={value} />,
        // },

        // {
        //     id: 'action',
        //     name: 'Thao tác',
        //     render: (_, record) => <ActionGroup record={record} actions={actions} />,
        // },
    ];

    return (
        <div className="flex flex-col h-full gap-4">
            <PageHeader title="Quản lý đặt bàn" subtitle="Quản lý và theo dõi các đơn đặt bàn" />

            <TableFilterCustom<BookingRestaurantParams>
                fields={[]}
                values={bookingRestaurantTable.filterValues}
                onValuesChange={bookingRestaurantTable.setFilterValues}
                onSubmit={bookingRestaurantTable.handleFilterSubmit}
                onReset={bookingRestaurantTable.handleFilterReset}
                footer={
                    <Button
                        type="submit"
                        variant="danger-soft"
                        size="lg"
                        isPending={bookingRestaurantTable.loading}
                    >
                        Tìm kiếm
                    </Button>
                }
            />
            <TablePaginationCustom<IBooking>
                columns={bookingColumns}
                data={bookingRestaurantTable.data ?? []}
                onChangPage={bookingRestaurantTable.handleChangePage}
                pagination={bookingRestaurantTable.pagination ?? DEFAULT_PAGINATION}
                isPending={bookingRestaurantTable.loading}
            />

            {/* <ModalFormTabs
                isOpen={open}
                title="Thông tin đăng ký nhà hàng"
                mode="view"
                values={formValues ?? {}}
                onValuesChange={() => {}}
                sections={restaurantSections()}
                onClose={close}
                onSubmit={() => {}}
                // isPending={detailQuery.isPending}
            /> */}
        </div>
    );
}

export default BookingsRestaurantPage;
