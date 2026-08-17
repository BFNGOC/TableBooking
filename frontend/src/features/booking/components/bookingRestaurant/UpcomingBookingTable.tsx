'use client';

import TablePaginationCustom, {
    ColumnTable,
} from '@/shared/components/table/TablePaginationCustom';
import { DEFAULT_PAGINATION } from '@/shared/constants/default-pagination';
import { IBooking } from '../../types/booking.type';

interface Props {
    columns: ColumnTable<IBooking>[];
    data: IBooking[];
    loading: boolean;
    pagination: any;
    onChangePage: (page: number) => void;
}

export default function UpcomingBookingTable({
    columns,
    data,
    loading,
    pagination,
    onChangePage,
}: Props) {
    return (
        <TablePaginationCustom
            columns={columns}
            data={data}
            isPending={loading}
            pagination={pagination ?? DEFAULT_PAGINATION}
            onChangPage={onChangePage}
        />
    );
}
