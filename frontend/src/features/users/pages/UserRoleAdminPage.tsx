'use client';

import PageHeader from '@/shared/components/layouts/PageHeader';
import { Button } from '@heroui/react';
import { userFilterFormFields } from '../constants/user-filter-form-fileld';
import TablePaginationCustom, {
    ColumnTable,
} from '@/shared/components/table/TablePaginationCustom';
import { UserFilterParams } from '../types/user-filter-params-type';
import { IUser } from '../types/user-type';
import { DEFAULT_PAGINATION } from '@/shared/constants/default-pagination';
import TableFilterCustom from '@/shared/components/table/TableFilterCustom';
import StatusTag from '../components/StatusTag';
import { Check, Eye, Pencil, Trash2, X } from 'lucide-react';
import { useFormModal } from '@/shared/hooks/useFormModal';
import ActionGroup, { TableAction } from '@/shared/components/table/ActionGroup';
import ModalFormTabs, { FormSection } from '@/shared/components/modals/ModalFormTabs';
import { userAccountFormField, userProfileFormField } from '../constants/user-section-form-field';
import useTable from '@/shared/hooks/useTable';
import { userRoleAdminApi } from '../api/user-api';
import { useCrudMutation } from '@/shared/hooks/useCrudMutation';
import { CreateUserPayload, UpdateUserPayload } from '../types/user-payload';
import { formatSectionFormValues } from '@/shared/utils/format-section-form-values';
import { useToast } from '@/shared/hooks/useToast';
import { userQueryKeys } from '../constants/query-key';
import { useUploadImage } from '@/features/upload/hook/useUploadImage';

function UserRoleAdminPage() {
    const { showToast } = useToast();
    const { getAll, create, update, delete: deleteUser, active, inactive } = userRoleAdminApi;

    const { open, mode, selectedRecord, setSelectedRecord, openCreate, openView, openEdit, close } =
        useFormModal<IUser>();

    const table = useTable<IUser, UserFilterParams>({
        queryKey: ['users'],
        fetchApi: getAll,
        removeApi: deleteUser,
        activeApi: active,
        inactiveApi: inactive,
        initialFilters: {
            keySearch: '',
            role: undefined,
            isActive: undefined,
        },
    });

    const uploadMutation = useUploadImage();

    const createMutation = useCrudMutation({
        queryKey: userQueryKeys.GET_ALL,
        api: create,
    });

    const updateMutation = useCrudMutation<{
        _id: string;
        payload: UpdateUserPayload;
    }>({
        queryKey: userQueryKeys.GET_ALL,
        api: ({ _id, payload }) => update(_id, payload),
    });

    const handleSubmitUser = (values: Partial<IUser>) => {
        const payload = formatSectionFormValues(values, userSections, 'toApi');

        if (mode === 'create') {
            createMutation.mutate(payload as unknown as CreateUserPayload, {
                onSuccess: (res) => {
                    showToast(
                        'success',
                        'Tạo người dùng thành công',
                        res?.message ?? 'Người dùng đã được tạo'
                    );
                    close();
                },

                onError: (error: any) => {
                    showToast(
                        'error',
                        'Tạo người dùng thất bại',
                        error?.response?.data?.message ?? 'Đã có lỗi xảy ra'
                    );
                },
            });
        } else {
            if (selectedRecord?._id) {
                updateMutation.mutate(
                    {
                        _id: selectedRecord._id,
                        payload: payload as UpdateUserPayload,
                    },
                    {
                        onSuccess: (res) => {
                            showToast(
                                'success',
                                'Cập nhật người dùng thành công',
                                res?.message ?? 'Thông tin người dùng đã được cập nhật'
                            );
                            close();
                        },

                        onError: (error: any) => {
                            showToast(
                                'error',
                                'Cập nhật người dùng thất bại',
                                error?.response?.data?.message ?? 'Đã có lỗi xảy ra'
                            );
                        },
                    }
                );
            }
        }
    };

    const userSections: FormSection[] = [
        {
            key: 'account',
            title: 'Thông tin tài khoản',
            fields: userAccountFormField,
        },
        {
            key: 'profile',
            title: 'Thông tin người dùng',
            fields: userProfileFormField,
            disabled: true,
        },
    ];

    const actions: TableAction<IUser>[] = [
        {
            icon: <Eye size={18} />,
            tooltip: 'Xem thông tin người dùng',
            onPress: openView,
        },
        {
            icon: <Pencil size={18} />,
            tooltip: 'Sửa thông tin người dùng',
            onPress: openEdit,
        },
        {
            icon: <Check size={18} />,
            tooltip: 'Kích hoạt người dùng',
            variant: 'secondary',
            show: (user) => !user.isActive,
            isPending: table.activating,
            confirm: {
                title: 'Kích hoạt người dùng',
                description: (user) => (
                    <>
                        `Bạn có chắc chắn muốn kích hoạt <strong>{user.name}</strong> (
                        <strong>{user.email}</strong>) không?`,
                    </>
                ),
            },
            onPress: (user) => table.handleActive(user._id),
        },
        {
            icon: <X size={18} />,
            tooltip: 'Vô hiệu hóa người dùng',
            variant: 'danger-soft',
            show: (user) => user.isActive,
            isPending: table.inactivating,
            confirm: {
                title: 'Vô hiệu hóa người dùng',
                description: (user) => (
                    <>
                        `Bạn có chắc chắn muốn vô hiệu hóa <strong>{user.name}</strong> (
                        <strong>{user.email}</strong>) không?`,
                    </>
                ),
            },
            onPress: (user) => table.handleInactive(user._id),
        },
        {
            icon: <Trash2 size={18} />,
            tooltip: 'Xóa người dùng',
            variant: 'danger',
            isPending: table.deleting,
            confirm: {
                title: 'Xóa người dùng',
                description: (user) => (
                    <>
                        Bạn có chắc chắn muốn xóa <strong>{user.name}</strong> (
                        <strong>{user.email}</strong>) không?
                    </>
                ),
            },
            onPress: (user) => table.handleDelete(user._id),
        },
    ];

    const userColumns: ColumnTable[] = [
        { id: 'name', name: 'Tên người dùng' },
        { id: 'email', name: 'Email' },
        { id: 'role', name: 'Vai trò' },
        {
            id: 'isActive',
            name: 'Trạng thái',
            render: (value) => <StatusTag status={value} />,
        },
        {
            id: 'action',
            name: 'Thao tác',
            render: (_, record) => <ActionGroup record={record} actions={actions} />,
        },
    ];

    const formValues = formatSectionFormValues(selectedRecord, userSections, 'toForm');

    console.log(formValues);

    return (
        <div className="flex flex-col h-full gap-4">
            <PageHeader
                title="Danh sách người dùng"
                subtitle="Thông tin chi tiết về người dùng"
                extra={
                    <Button variant="danger-soft" onPress={openCreate}>
                        + Tạo người dùng
                    </Button>
                }
            />

            <TableFilterCustom<UserFilterParams>
                fields={userFilterFormFields}
                values={table.filterValues}
                onValuesChange={table.setFilterValues}
                onSubmit={table.handleFilterSubmit}
                onReset={table.handleFilterReset}
                footer={
                    <Button type="submit" variant="danger-soft" size="lg" isPending={table.loading}>
                        Tìm kiếm
                    </Button>
                }
            />

            <TablePaginationCustom<IUser>
                columns={userColumns}
                data={table.data ?? []}
                onChangPage={table.handleChangePage}
                pagination={table.pagination ?? DEFAULT_PAGINATION}
                isPending={table.loading}
            />

            <ModalFormTabs<IUser>
                isOpen={open}
                title={({ mode }) => {
                    switch (mode) {
                        case 'create':
                            return 'Thêm người dùng';
                        case 'edit':
                            return 'Cập nhật người dùng';
                        case 'view':
                            return 'Chi tiết người dùng';
                    }
                }}
                mode={mode}
                values={formValues ?? {}}
                onValuesChange={(values) => setSelectedRecord(values as IUser)}
                sections={userSections}
                onClose={close}
                onSubmit={handleSubmitUser}
                isPending={
                    createMutation.isPending || updateMutation.isPending || uploadMutation.isPending
                }
            />
        </div>
    );
}

export default UserRoleAdminPage;
