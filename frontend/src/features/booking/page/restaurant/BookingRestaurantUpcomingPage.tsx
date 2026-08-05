'use client';

import PageHeader from '@/shared/components/layouts/PageHeader';
import useTable from '@/shared/hooks/useTable';
import { BookingRestaurantParams } from '../../types/booking-restaurant-filter-params-type';
import { IBooking, BookingStatus } from '../../types/booking.type';
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
import { useBookingStatusCount } from '../../hook/useCount';
import StatusTabs from '@/shared/components/tabs/StatusTabs';
import { BOOKING_STATUS_UPCOMING_OPTIONS } from '../../constants/booking-options';
import ActionGroup, { TableAction } from '@/shared/components/table/ActionGroup';
import { useBookingDetail } from '../../hook/useBooking';
import { useFormModal } from '@/shared/hooks/useFormModal';
import { Eye } from 'lucide-react';
import ModalFormTabs from '@/shared/components/modals/ModalFormTabs';
import { bookingSections } from '../../constants/booking-section';
import { formatSectionFormValues } from '@/shared/utils/format-section-form-values';

function BookingRestaurantUpcomingPage() {
    const { getUpcoming } = bookingRoleRestaurantApi;

    const { data: statusCount } = useBookingStatusCount();

    const { open, openView, close, selectedRecord } = useFormModal<IBooking>();

    const detailQuery = useBookingDetail(selectedRecord?._id);

    const bookingRestaurantTable = useTable<IBooking, BookingRestaurantParams>({
        queryKey: bookingQueryKeys.GET_BOOKING_UPCOMING_RESTAURANT,
        fetchApi: getUpcoming,
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

    const getStatusCounts = (): Partial<Record<BookingStatus, number>> => ({
        [BookingStatus.PENDING]: statusCount?.pending ?? 0,
        [BookingStatus.CONFIRMED]: statusCount?.confirmed ?? 0,
        [BookingStatus.REJECTED]: statusCount?.rejected ?? 0,
        [BookingStatus.CANCELLED]: statusCount?.cancelled ?? 0,
    });

    const formValues = formatSectionFormValues(
        detailQuery.data ?? null,
        bookingSections(),
        'toForm'
    );

    return (
        <div className="flex flex-col h-full gap-4">
            <PageHeader
                title="Đơn đặt bàn sắp tới"
                subtitle="Xem các đơn đặt bàn sắp tới của nhà hàng"
                extra={
                    <Button
                        variant="danger-soft"
                        onPress={bookingRestaurantTable.handleFilterReset}
                    >
                        Làm mới
                    </Button>
                }
            />

            <StatusTabs
                title="TỔNG ĐƠN ĐẶT"
                allLabel="Tất cả"
                total={statusCount?.upcoming ?? 0}
                selectedStatus={bookingRestaurantTable.params.status}
                onStatusChange={(value) =>
                    bookingRestaurantTable.handleParamsChange({ status: value })
                }
                options={BOOKING_STATUS_UPCOMING_OPTIONS}
                counts={getStatusCounts()}
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

export default BookingRestaurantUpcomingPage;
