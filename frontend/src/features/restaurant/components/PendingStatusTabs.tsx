'use client';

import React from 'react';
import { RestaurantVerifyStatus } from '../types/restaurant.type';
import { VerifyStatusCount } from '../types/restaurant-admin-response-type';
import { RESTAURANT_VERIFY_STATUS_OPTIONS } from '../constants/restaurant-options';
import StatusTabs from '@/shared/components/tabs/StatusTabs';

interface PendingStatusTabsProps {
    status?: RestaurantVerifyStatus;
    setStatus: (value?: RestaurantVerifyStatus) => void;
    verifyStatusCount: VerifyStatusCount;
}

function PendingStatusTabs({ status, setStatus, verifyStatusCount }: PendingStatusTabsProps) {
    const countMap: Partial<Record<RestaurantVerifyStatus, number>> = {
        [RestaurantVerifyStatus.EMAIL_PENDING]: verifyStatusCount.emailPending,
        [RestaurantVerifyStatus.PENDING]: verifyStatusCount.pending,
        [RestaurantVerifyStatus.APPROVED]: verifyStatusCount.approved,
        [RestaurantVerifyStatus.REJECTED]: verifyStatusCount.rejected,
    };

    return (
        <StatusTabs
            title="TỔNG YÊU CẦU"
            allLabel="Tất cả"
            total={verifyStatusCount.total}
            selectedStatus={status}
            onStatusChange={setStatus}
            options={RESTAURANT_VERIFY_STATUS_OPTIONS}
            counts={countMap}
        />
    );
}

export default PendingStatusTabs;
