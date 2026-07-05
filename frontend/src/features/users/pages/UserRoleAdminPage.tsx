'use client';

import CustomForm from '@/shared/components/form/CustomForm';
import PageHeader from '@/shared/components/layouts/PageHeader';
import { Button } from '@heroui/react';
import { userFilterFormFields } from '../contants/user-filter-form-fileld';
import TablePaginationCustom, {
    ColumnTable,
} from '@/shared/components/table/TablePaginationCustom';
import { useToast } from '@/shared/hooks/useToast';
import { useGetAll } from '../hooks/useGetAll';
import { UserFilterParams } from '../types/user-filter-params-type';
import { useState } from 'react';
import { IUser } from '../types/user-type';
import { DEFAULT_PAGINATION } from '@/shared/constants/default-pagination';
import TableFilterCustom from '@/shared/components/table/TableFilterCustom';

function UserRoleAdminPage() {
    const { showToast } = useToast();

    const [filterValues, setFilterValues] = useState<Partial<UserFilterParams>>({
        keySearch: '',
        isActive: undefined,
        role: undefined,
    });

    const [submitFilterValues, setSubmitFilterValues] = useState<Partial<UserFilterParams>>({
        keySearch: '',
        isActive: undefined,
        role: undefined,
    });

    const [currentPage, setCurrentPage] = useState(1);

    const [pageSize, setPageSize] = useState(1);

    const { data, isPending, isFetching } = useGetAll({
        ...submitFilterValues,
        currentPage,
        pageSize,
    });

    const handleFilterSubmit = (values: Partial<UserFilterParams>) => {
        setSubmitFilterValues(values);
        setCurrentPage(1);
        setPageSize(1);
    };

    const handleFilterReset = () => {
        const resetValues = {
            keySearch: '',
            role: undefined,
            isActive: undefined,
        };

        setFilterValues(resetValues);
        setSubmitFilterValues(resetValues);
        setCurrentPage(1);
    };

    const handleChangePage = (nextPage: number) => {
        setCurrentPage(nextPage);
    };

    const userColumns: ColumnTable[] = [
        { id: 'name', name: 'Tên người dùng' },
        { id: 'email', name: 'Email' },
        { id: 'role', name: 'Vai trò' },
        { id: 'isActive', name: 'Trạng thái' },
    ];

    return (
        <div className="flex flex-col h-full gap-4">
            <PageHeader
                title="Danh sách người dùng"
                subtitle="Thông tin chi tiết về người dùng"
                extra={<Button variant="danger-soft">+ Add Role</Button>}
            />

            <TableFilterCustom<UserFilterParams>
                fields={userFilterFormFields}
                values={filterValues}
                onValuesChange={setFilterValues}
                onSubmit={handleFilterSubmit}
                onReset={handleFilterReset}
                footer={
                    <Button type="submit" variant="danger-soft" size="lg">
                        Tìm kiếm
                    </Button>
                }
            />

            <TablePaginationCustom<IUser>
                columns={userColumns}
                data={data?.data ?? []}
                onChangPage={handleChangePage}
                pagination={data?.meta ?? DEFAULT_PAGINATION}
                isPending={isPending}
            />
        </div>
    );
}

export default UserRoleAdminPage;
