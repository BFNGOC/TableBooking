'use client';

import PageHeader from '@/shared/components/layouts/PageHeader';
import { Button } from '@heroui/react';

function RestaurantsRoleAdminPage() {
    return (
        <div className="flex flex-col h-full gap-4">
            <PageHeader
                title="Danh sách nhà hàng"
                subtitle="Thông tin chi tiết về nhà hàng đối tác"
                // extra={
                //     <Button variant="danger-soft" onPress={openCreate}>
                //         + Tạo nhà hàng
                //     </Button>
                // }
            />
        </div>
    );
}

export default RestaurantsRoleAdminPage;
