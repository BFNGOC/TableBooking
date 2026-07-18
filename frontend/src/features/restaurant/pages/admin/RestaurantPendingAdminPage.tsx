'use client';

import PageHeader from '@/shared/components/layouts/PageHeader';
import { Button } from '@heroui/react';
import { RotateCcw } from 'lucide-react';
import { IRestaurant, RestaurantVerifyStatus } from '../../types/restaurant.type';
import { useState } from 'react';
import PendingStatusTabs from '../../components/PendingStatusTabs';
import TableFilterCustom from '@/shared/components/table/TableFilterCustom';
import { RestaurantFilterRoleAdminParams } from '../../types/restaurant-filter-params-type';
import { restaurantAdminFilterFormFields } from '../../constants/restaurant-admin-filter-form-field';
import useTable from '@/shared/hooks/useTable';
import { restaurantQueryKeys } from '../../constants/query_key';
import { useFormModal } from '@/shared/hooks/useFormModal';
import { restaurantRoleAdminApi } from '../../api/restaurant-api';
import { RestaurantListAdminResponse } from '../../types/restaurant-response-type';

function RestaurantPendingAdminPage() {
    const [status, setStatus] = useState<RestaurantVerifyStatus | undefined>();
    const { getAll } = restaurantRoleAdminApi;

    const { open, mode, selectedRecord, setSelectedRecord, openCreate, openView, openEdit, close } =
        useFormModal<IRestaurant>();

    const restaurantPendingAdmintable = useTable<
        RestaurantListAdminResponse,
        RestaurantFilterRoleAdminParams
    >({
        queryKey: restaurantQueryKeys.GET_RESTAURANT_LIST,
        fetchApi: getAll,
    });

    return (
        <div className="flex flex-col h-full gap-4">
            <PageHeader
                title="Phê duyệt đối tác nhà hàng"
                subtitle={
                    <>
                        Hiện có <span className="font-bold text-[#6f4e37]">12</span> yêu cầu đăng ký
                        đang chờ xử lý
                    </>
                }
                extra={
                    <Button variant="danger-soft">
                        <RotateCcw />
                        Làm mới
                    </Button>
                }
            />

            <PendingStatusTabs status={status} setStatus={setStatus} />
        </div>
    );
}

export default RestaurantPendingAdminPage;
