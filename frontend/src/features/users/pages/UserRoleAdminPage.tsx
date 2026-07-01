'use client';

import CustomCard from '@/shared/components/card/CustomCard';
import CustomForm from '@/shared/components/form/CustomForm';
import PageHeader from '@/shared/components/layouts/PageHeader';
import { Button } from '@heroui/react';
import { userFilterFormFields } from '../contants/user-filter-form-fileld';
import TablePaginationCustom from '@/shared/components/table/TablePaginationCustom';

function UserRoleAdminPage() {
    const handleSubmit = (data: Record<string, any>) => {
        console.log('Form submitted:', data);
    };

    return (
        <div className="flex flex-col h-full gap-4">
            <PageHeader
                title="Danh sách người dùng"
                subtitle="Thông tin chi tiết về người dùng"
                extra={<Button variant="danger-soft">+ Add Role</Button>}
            />

            <CustomCard>
                <CustomForm
                    fields={userFilterFormFields}
                    onSubmit={handleSubmit}
                    footer={
                        <Button
                            type="submit"
                            className="h-12 px-10 bg-[#6f4e37]"
                            // isPending={isPending}
                        >
                            Tìm kiếm
                        </Button>
                    }
                />
            </CustomCard>

            <CustomCard>
                <TablePaginationCustom
                    columns={[]}
                    data={[]}
                    onChangPage={() => {}}
                    pagination={{ currentPage: 1, totalPages: 1, totalItems: 1, pageSize: 10 }}
                />
            </CustomCard>
        </div>
    );
}

export default UserRoleAdminPage;
