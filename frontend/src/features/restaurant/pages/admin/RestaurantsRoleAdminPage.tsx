'use client';

import PageHeader from '@/shared/components/layouts/PageHeader';
import { Button } from '@heroui/react';
import { ArrowDown10, Eye, RotateCcw, ArrowUp10, Check, X, Trash2 } from 'lucide-react';
import { RestaurantStatus, RestaurantVerifyStatus } from '../../types/restaurant.type';
import { useState } from 'react';
import { RestaurantFilterRoleAdminParams } from '../../types/restaurant-filter-params-type';
import useTable from '@/shared/hooks/useTable';
import { restaurantQueryKeys } from '../../constants/query_key';
import { useFormModal } from '@/shared/hooks/useFormModal';
import { restaurantRoleAdminApi } from '../../api/restaurant-api';
import {
    RestaurantListAdminResponse,
    RestaurantOnboardingDetail,
} from '../../types/restaurant-response-type';
import TablePaginationCustom, {
    ColumnTable,
} from '@/shared/components/table/TablePaginationCustom';
import VerifyStatus from '../../components/VerifyStatusTag';
import ActionGroup, { TableAction } from '@/shared/components/table/ActionGroup';
import { DEFAULT_PAGINATION } from '@/shared/constants/default-pagination';
import { formatDateTime } from '@/shared/utils/date';
import ModalFormTabs from '@/shared/components/modals/ModalFormTabs';
import { useRestaurantAdminDetail } from '../../hooks/useRestaurantAdmin';
import { formatSectionFormValues } from '@/shared/utils/format-section-form-values';
import { restaurantSections } from '../../constants/restaurant-section';
import { restaurantAdminFilterFormFields } from '../../constants/restaurant-admin-filter-form-field';
import TableFilterCustom from '@/shared/components/table/TableFilterCustom';
import { useCuisineTypes } from '../../hooks/useCuisineTypes';

function RestaurantsRoleAdminPage() {
    const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('ASC');

    const { open, openView, close, selectedRecord } = useFormModal<RestaurantListAdminResponse>();

    const detailQuery = useRestaurantAdminDetail(selectedRecord?._id);

    const { data: cuisineTypes } = useCuisineTypes();

    const { getAll } = restaurantRoleAdminApi;

    const restaurantAdminTable = useTable<
        RestaurantListAdminResponse,
        RestaurantFilterRoleAdminParams
    >({
        queryKey: restaurantQueryKeys.GET_RESTAURANT_LIST,
        fetchApi: getAll,
        initialFilters: {
            verifyStatus: RestaurantVerifyStatus.APPROVED,
        },
    });

    const handleActive = () => {};

    const handleInactive = () => {};

    const handleDelete = () => {};

    const actions: TableAction<RestaurantListAdminResponse>[] = [
        {
            icon: <Eye size={18} />,
            tooltip: 'Xem thông tin người dùng',
            onPress: (record) => {
                openView(record);
            },
        },
        {
            icon: <Check />,
            tooltip: 'Kích hoạt nhà hàng',
            variant: 'danger-soft',
            onPress: handleActive,
            show: (restaurant) =>
                restaurant.verifyStatus == RestaurantVerifyStatus.APPROVED &&
                restaurant.status == RestaurantStatus.INACTIVE,
        },
        {
            icon: <X />,
            tooltip: 'Vô hiệu hóa nhà hàng',
            variant: 'danger-soft',
            onPress: handleInactive,
            show: (restaurant) =>
                restaurant.verifyStatus == RestaurantVerifyStatus.APPROVED &&
                restaurant.status == RestaurantStatus.ACTIVE,
        },
        {
            icon: <Trash2 />,
            tooltip: 'Xóa nhà hàng',
            variant: 'danger',
            onPress: handleDelete,
            show: (restaurant) =>
                restaurant.verifyStatus == RestaurantVerifyStatus.APPROVED &&
                restaurant.status == RestaurantStatus.INACTIVE,
        },
    ];

    const restaurantColumns: ColumnTable[] = [
        { id: 'restaurantCode', name: 'Mã nhà hàng' },
        { id: 'restaurantName', name: 'Tên nhà hàng' },
        { id: 'taxCode', name: 'Mã số thuế' },
        {
            id: 'onboardingRequestedAt',
            name: (
                <div className="flex items-center gap-3">
                    Ngày tạo
                    {restaurantAdminTable.data.length > 0 &&
                        (sortOrder === 'DESC' ? (
                            <ArrowDown10
                                size={16}
                                className="cursor-pointer"
                                onClick={() => {
                                    setSortOrder('ASC');

                                    restaurantAdminTable.handleParamsChange({
                                        sort: 'onboardingRequestedAt:ASC',
                                    });
                                }}
                            />
                        ) : (
                            <ArrowUp10
                                size={16}
                                className="cursor-pointer"
                                onClick={() => {
                                    setSortOrder('DESC');

                                    restaurantAdminTable.handleParamsChange({
                                        sort: 'onboardingRequestedAt:DESC',
                                    });
                                }}
                            />
                        ))}
                </div>
            ),
            render(value) {
                return formatDateTime(value);
            },
        },
        {
            id: 'verifyStatus',
            name: 'Trạng thái',
            render: (value) => <VerifyStatus status={value} />,
        },

        {
            id: 'action',
            name: 'Thao tác',
            render: (_, record) => <ActionGroup record={record} actions={actions} />,
        },
    ];

    const formValues = formatSectionFormValues(
        detailQuery.data?.data ?? null,
        restaurantSections(cuisineTypes),
        'toForm'
    );

    return (
        <div className="flex flex-col h-full gap-4">
            <PageHeader
                title="Danh sách nhà hàng"
                subtitle="Xem thông tin chi tiết nhà hàng đối tác"
                extra={
                    <Button variant="danger-soft" onPress={restaurantAdminTable.handleFilterReset}>
                        <RotateCcw />
                        Làm mới
                    </Button>
                }
            />

            <TableFilterCustom<RestaurantFilterRoleAdminParams>
                fields={restaurantAdminFilterFormFields}
                values={restaurantAdminTable.filterValues}
                onValuesChange={restaurantAdminTable.setFilterValues}
                onSubmit={restaurantAdminTable.handleFilterSubmit}
                onReset={restaurantAdminTable.handleFilterReset}
                footer={
                    <Button
                        type="submit"
                        variant="danger-soft"
                        size="lg"
                        isPending={restaurantAdminTable.loading}
                    >
                        Tìm kiếm
                    </Button>
                }
            />

            <TablePaginationCustom<RestaurantOnboardingDetail>
                columns={restaurantColumns}
                data={restaurantAdminTable.data ?? []}
                onChangPage={restaurantAdminTable.handleChangePage}
                pagination={restaurantAdminTable.pagination ?? DEFAULT_PAGINATION}
                isPending={restaurantAdminTable.loading}
            />

            <ModalFormTabs
                isOpen={open}
                title="Thông tin đăng ký nhà hàng"
                mode="view"
                values={formValues ?? {}}
                onValuesChange={() => {}}
                sections={restaurantSections(cuisineTypes)}
                onClose={close}
                onSubmit={() => {}}
                isPending={detailQuery.isPending}
            />
        </div>
    );
}

export default RestaurantsRoleAdminPage;
