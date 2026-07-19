'use client';

import { Separator, Tabs } from '@heroui/react';
import { RestaurantVerifyStatus } from '../types/restaurant.type';
import CustomCard from '@/shared/components/card/CustomCard';
import { VerifyStatusCount } from '../types/restaurant-response-type';
import React from 'react';
import { RESTAURANT_VERIFY_STATUS_OPTIONS } from '../constants/restaurant-options';

interface PendingStatusTabsProps {
    status?: RestaurantVerifyStatus;
    setStatus: (value?: RestaurantVerifyStatus) => void;
    verifyStatusCount: VerifyStatusCount;
}

function PendingStatusTabs({ status, setStatus, verifyStatusCount }: PendingStatusTabsProps) {
    const countMap = {
        [RestaurantVerifyStatus.EMAIL_PENDING]: verifyStatusCount.emailPending,
        [RestaurantVerifyStatus.PENDING]: verifyStatusCount.pending,
        [RestaurantVerifyStatus.APPROVED]: verifyStatusCount.approved,
        [RestaurantVerifyStatus.REJECTED]: verifyStatusCount.rejected,
    };

    return (
        <CustomCard>
            <div className="flex items-center justify-between w-full p-4 gap-10">
                <div className="flex flex-col items-center gap-1 shrink-0">
                    <div className="text-[11px] font-bold tracking-wider text-gray-400 uppercase">
                        TỔNG YÊU CẦU
                    </div>

                    <div className="text-4xl font-bold text-[#6f4e37] leading-none">
                        {verifyStatusCount.total}
                    </div>
                </div>

                <Separator orientation="vertical" className="bg-[#6f4e37]" />

                <Tabs
                    variant="primary"
                    selectedKey={status ?? 'ALL'}
                    onSelectionChange={(key) => {
                        setStatus(key === 'ALL' ? undefined : (key as RestaurantVerifyStatus));
                    }}
                    className="flex-1 w-full"
                >
                    <Tabs.ListContainer>
                        <Tabs.List className="bg-transparent gap-6 p-0 items-center">
                            <Tabs.Tab
                                id="ALL"
                                className="relative px-5 py-2 text-xs font-medium rounded-sm transition-colors data-[selected=true]:text-white text-gray-500 flex flex-col items-center justify-center leading-tight min-h-12"
                            >
                                Tất cả ({verifyStatusCount.total})
                                <Tabs.Indicator className="bg-[#6f4e37] rounded-sm" />
                            </Tabs.Tab>

                            {RESTAURANT_VERIFY_STATUS_OPTIONS.map((item) => (
                                <React.Fragment key={item.id}>
                                    <Separator orientation="vertical" className="bg-[#6f4e37]" />

                                    <Tabs.Tab
                                        id={item.id}
                                        className="relative px-5 py-2 text-xs font-medium rounded-sm transition-colors data-[selected=true]:text-white text-gray-500 flex flex-col items-center justify-center leading-tight min-h-12"
                                    >
                                        {item.text} ({countMap[item.id] ?? 0})
                                        <Tabs.Indicator className="bg-[#6f4e37] rounded-sm" />
                                    </Tabs.Tab>
                                </React.Fragment>
                            ))}
                        </Tabs.List>
                    </Tabs.ListContainer>
                </Tabs>
            </div>
        </CustomCard>
    );
}

export default PendingStatusTabs;
