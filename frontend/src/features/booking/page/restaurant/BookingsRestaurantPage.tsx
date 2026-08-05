'use client';

import PageHeader from '@/shared/components/layouts/PageHeader';
import useTable from '@/shared/hooks/useTable';
import { BookingRestaurantParams } from '../../types/booking-restaurant-filter-params-type';
import { IBooking } from '../../types/booking.type';
import { bookingRoleRestaurantApi } from '../../api/booking-api';
import TablePaginationCustom, {
    ColumnTable,
} from '@/shared/components/table/TablePaginationCustom';
import { DEFAULT_PAGINATION } from '@/shared/constants/default-pagination';
import TableFilterCustom from '@/shared/components/table/TableFilterCustom';
import { Button } from '@heroui/react';
import { bookingQueryKeys } from '../../constants/query-key';
import { formatDate, formatDateTime } from '@/shared/utils/date';
import {
    translateBookingStatus,
    translateDepositStatus,
    translatePaymentStatus,
} from '../../utils/booking-status';
import { bookingRestaurantFilterFormFields } from '../../constants/booking-filter-form-fields';
import { useBookingDetail } from '../../hook/useBooking';
import ActionGroup, { TableAction } from '@/shared/components/table/ActionGroup';
import { Eye } from 'lucide-react';
import { useFormModal } from '@/shared/hooks/useFormModal';
import ModalFormTabs from '@/shared/components/modals/ModalFormTabs';
import { formatSectionFormValues } from '@/shared/utils/format-section-form-values';
import { bookingSections } from '../../constants/booking-section';

function BookingsRestaurantPage() {
    const { getAll } = bookingRoleRestaurantApi;

    const { open, openView, close, selectedRecord } = useFormModal<IBooking>();

    const detailQuery = useBookingDetail(selectedRecord?._id);

    const bookingRestaurantTable = useTable<IBooking, BookingRestaurantParams>({
        queryKey: bookingQueryKeys.GET_BOOKING_LIST_RESTAURANT,
        fetchApi: getAll,
    });

    const actions: TableAction<IBooking>[] = [
        {
            icon: <Eye size={18} />,
            tooltip: 'Xem thông tin đơn đặt bàn',
            onPress: (record) => {
                openView(record);
            },
        },
    ];

    const bookingColumns: ColumnTable<IBooking>[] = [
        { id: '_id', name: 'Mã đặt bàn' },
        { id: 'contactName', name: 'Tên khách' },
        { id: 'contactPhone', name: 'SĐT liên hệ' },
        {
            id: 'bookingDate',
            name: 'Ngày đặt',
            render: (value) => formatDate(value),
        },
        { id: 'startTime', name: 'Giờ bắt đầu' },
        { id: 'endTime', name: 'Giờ kết thúc' },
        {
            id: 'status',
            name: 'Trạng thái đặt bàn',
            render: (value) => translateBookingStatus(value),
        },
        {
            id: 'paymentStatus',
            name: 'Trạng thái thanh toán',
            render: (value) => translatePaymentStatus(value),
        },
        {
            id: 'depositStatus',
            name: 'Tiền cọc',
            render: (value) => translateDepositStatus(value),
        },
        {
            id: 'createdAt',
            name: 'Ngày tạo',
            render: (value) => formatDateTime(value),
        },
        {
            id: 'action',
            name: 'Thao tác',
            render: (_, record) => <ActionGroup record={record} actions={actions} />,
        },
    ];

    const formValues = formatSectionFormValues(
        detailQuery.data ?? null,
        bookingSections(),
        'toForm'
    );

    return (
        <div className="flex flex-col h-full gap-4">
            <PageHeader
                title="Quản lý đặt bàn"
                subtitle="Xem tất cả đơn đặt bàn của nhà hàng"
                extra={
                    <Button
                        variant="danger-soft"
                        onPress={bookingRestaurantTable.handleFilterReset}
                    >
                        Làm mới
                    </Button>
                }
            />

            <TableFilterCustom<BookingRestaurantParams>
                fields={bookingRestaurantFilterFormFields}
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

            <ModalFormTabs
                isOpen={open}
                title="Thông tin đơn đặt bàn"
                mode="view"
                values={formValues ?? {}}
                onValuesChange={() => {}}
                sections={bookingSections()}
                onClose={close}
                onSubmit={() => {}}
                isPending={detailQuery.isPending}
            />
        </div>
    );
}

export default BookingsRestaurantPage;
