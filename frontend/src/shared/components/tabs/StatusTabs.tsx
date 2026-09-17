'use client';

import { Separator, Tabs } from '@heroui/react';
import CustomCard from '@/shared/components/card/CustomCard';
import React from 'react';

export type StatusOption<T extends string> = {
    id: T;
    text: string;
};

export interface StatusTabsProps<T extends string> {
    title?: string;
    totalLabel?: string;
    total: number;
    selectedStatus?: T;
    onStatusChange: (value?: T) => void;
    options: Array<StatusOption<T>>;
    counts: Partial<Record<T, number>>;
    allLabel?: string;
    className?: string;
}

function StatusTabs<T extends string>({
    title = 'TỔNG YÊU CẦU',
    totalLabel = 'TỔNG YÊU CẦU',
    total,
    selectedStatus,
    onStatusChange,
    options,
    counts,
    allLabel = 'Tất cả',
    className = '',
}: StatusTabsProps<T>) {
    const selectedKey = selectedStatus ?? 'ALL';

    return (
        <CustomCard className={className}>
            <div className="flex items-center justify-between w-full p-4 gap-10">
                <div className="flex flex-col items-center gap-1 shrink-0">
                    <div className="text-[11px] font-bold tracking-wider text-gray-400 uppercase">
                        {title}
                    </div>

                    <div className="text-4xl font-bold text-[#6f4e37] leading-none">{total}</div>
                </div>

                <Separator orientation="vertical" className="bg-[#6f4e37]" />

                <Tabs
                    variant="primary"
                    selectedKey={selectedKey}
                    onSelectionChange={(key) => {
                        onStatusChange(key === 'ALL' ? undefined : (key as T));
                    }}
                    className="flex-1 w-full"
                >
                    <Tabs.ListContainer>
                        <Tabs.List className="bg-transparent gap-6 p-0 items-center">
                            <Tabs.Tab
                                id="ALL"
                                className="relative px-5 py-2 text-xs font-medium rounded-sm transition-colors data-[selected=true]:text-white text-gray-500 flex flex-col items-center justify-center leading-tight min-h-12"
                            >
                                {allLabel} ({total})
                                <Tabs.Indicator className="bg-[#6f4e37] rounded-sm" />
                            </Tabs.Tab>

                            {options.map((item) => (
                                <React.Fragment key={item.id}>
                                    <Separator orientation="vertical" className="bg-[#6f4e37]" />

                                    <Tabs.Tab
                                        id={item.id}
                                        className="relative px-5 py-2 text-xs font-medium rounded-sm transition-colors data-[selected=true]:text-white text-gray-500 flex flex-col items-center justify-center leading-tight min-h-12"
                                    >
                                        {item.text} ({counts[item.id] ?? 0})
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

export default StatusTabs;
