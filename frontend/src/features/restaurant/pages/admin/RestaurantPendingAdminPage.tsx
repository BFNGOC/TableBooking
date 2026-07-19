'use client';

import PageHeader from '@/shared/components/layouts/PageHeader';
import { Button } from '@heroui/react';
import { ArrowDown10, Eye, RotateCcw, ArrowUp10, Search, Check, X } from 'lucide-react';
import { RestaurantVerifyStatus } from '../../types/restaurant.type';
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
import { formatDateTime } from '@/shared/utils/date';
import { useVerifyStatusCount } from '../../hooks/useCount';
import ModalFormTabs from '@/shared/components/modals/ModalFormTabs';
import { useRestaurantAdminDetail } from '../../hooks/useRestaurantAdmin';
import { formatSectionFormValues } from '@/shared/utils/format-section-form-values';
import { restaurantSections } from '../../constants/restaurant-section';
import PendingStatusTabs from '../../components/PendingStatusTabs';
import { DEFAULT_PAGINATION } from '@/shared/constants/default-pagination';

function RestaurantPendingAdminPage() {
    const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('ASC');

    const { open, openView, close, selectedRecord } = useFormModal<RestaurantListAdminResponse>();

    const detailQuery = useRestaurantAdminDetail(selectedRecord?._id);

    const { getAll } = restaurantRoleAdminApi;

    const { data: verifyStatusCount } = useVerifyStatusCount();

    const DEFAULT_VERIFY_STATUS_COUNT = {
        total: 0,
        emailPending: 0,
        pending: 0,
        approved: 0,
        rejected: 0,
    };

    const restaurantPendingAdminTable = useTable<
        RestaurantListAdminResponse,
        RestaurantFilterRoleAdminParams
    >({
        queryKey: restaurantQueryKeys.GET_RESTAURANT_LIST,
        fetchApi: getAll,
    });

    const handleChangeStatus = (status?: RestaurantVerifyStatus) => {
        restaurantPendingAdminTable.handleParamsChange({
            verifyStatus: status,
        });
    };

    const handleCheckTaxCode = () => {};

    const handleApprove = () => {};

    const handleReject = () => {};

    const actions: TableAction<RestaurantListAdminResponse>[] = [
        {
            icon: <Eye size={18} />,
            tooltip: 'Xem thông tin người dùng',
            onPress: (record) => {
                openView(record);
            },
        },
        {
            icon: <Search />,
            tooltip: 'Kiểm tra MST',
            onPress: handleCheckTaxCode,
            show: (restaurant) => restaurant.verifyStatus == RestaurantVerifyStatus.PENDING,
        },
        {
            icon: <Check />,
            tooltip: 'Duyệt',
            variant: 'danger-soft',
            onPress: handleApprove,
            show: (restaurant) => restaurant.verifyStatus == RestaurantVerifyStatus.PENDING,
        },
        {
            icon: <X />,
            tooltip: 'Từ chối',
            variant: 'danger',
            onPress: handleReject,
            show: (restaurant) => restaurant.verifyStatus == RestaurantVerifyStatus.PENDING,
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
                    {restaurantPendingAdminTable.data.length > 0 &&
                        (sortOrder === 'DESC' ? (
                            <ArrowDown10
                                size={16}
                                className="cursor-pointer"
                                onClick={() => {
                                    setSortOrder('ASC');

                                    restaurantPendingAdminTable.handleParamsChange({
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

                                    restaurantPendingAdminTable.handleParamsChange({
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
        restaurantSections(),
        'toForm'
    );

    return (
        <div className="flex flex-col h-full gap-4">
            <PageHeader
                title="Phê duyệt đối tác nhà hàng"
                subtitle={
                    <>
                        Hiện có{' '}
                        <span className="font-bold text-[#6f4e37]">
                            {verifyStatusCount?.total ?? 0}
                        </span>{' '}
                        yêu cầu đăng ký đang chờ xử lý
                    </>
                }
                extra={
                    <Button
                        variant="danger-soft"
                        onPress={restaurantPendingAdminTable.handleFilterReset}
                    >
                        <RotateCcw />
                        Làm mới
                    </Button>
                }
            />

            <PendingStatusTabs
                status={restaurantPendingAdminTable.params.verifyStatus}
                setStatus={handleChangeStatus}
                verifyStatusCount={verifyStatusCount ?? DEFAULT_VERIFY_STATUS_COUNT}
            />

            <TablePaginationCustom<RestaurantOnboardingDetail>
                columns={restaurantColumns}
                data={restaurantPendingAdminTable.data ?? []}
                onChangPage={restaurantPendingAdminTable.handleChangePage}
                pagination={restaurantPendingAdminTable.pagination ?? DEFAULT_PAGINATION}
                isPending={restaurantPendingAdminTable.loading}
            />

            <ModalFormTabs
                isOpen={open}
                title="Thông tin đăng ký nhà hàng"
                mode="view"
                values={formValues ?? {}}
                onValuesChange={() => {}}
                sections={restaurantSections()}
                onClose={close}
                onSubmit={() => {}}
                isPending={detailQuery.isPending}
            />
        </div>
    );
}

export default RestaurantPendingAdminPage;
