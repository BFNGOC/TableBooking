import { Separator, Tabs } from '@heroui/react';
import { RestaurantVerifyStatus } from '../types/restaurant.type';
import CustomCard from '@/shared/components/card/CustomCard';

interface PendingStatusTabsProps {
    status: any;
    setStatus: (values: any) => void;
}

function PendingStatusTabs({ status, setStatus }: PendingStatusTabsProps) {
    return (
        <CustomCard>
            <div className="flex items-center justify-between w-full p-4 gap-10">
                <div className="flex flex-col items-start gap-1 shrink-0">
                    <div className="text-[11px] font-bold tracking-wider text-gray-400 uppercase">
                        TỔNG YÊU CẦU
                    </div>
                    <div className="text-4xl font-bold text-[#6f4e37] leading-none">148</div>
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
                                className="relative px-5 py-2 text-xs font-medium rounded-sm transition-colors data-[selected=true]:text-white text-gray-500 flex flex-col items-center justify-center leading-tight min-h-12 border-[#6f4e37]"
                            >
                                Tất cả
                                <Tabs.Indicator className="bg-[#6f4e37] rounded-sm" />
                            </Tabs.Tab>

                            <Separator orientation="vertical" className="bg-[#6f4e37]" />

                            <Tabs.Tab
                                id={RestaurantVerifyStatus.EMAIL_PENDING}
                                className="relative px-5 py-2 text-xs font-medium rounded-sm transition-colors data-[selected=true]:text-white text-gray-500 flex flex-col items-center justify-center leading-tight min-h-12"
                            >
                                <span>Email</span>
                                <span>Pending (3)</span>
                                <Tabs.Indicator className="bg-[#6f4e37] rounded-sm" />
                            </Tabs.Tab>

                            <Separator orientation="vertical" className="bg-[#6f4e37]" />

                            <Tabs.Tab
                                id={RestaurantVerifyStatus.PENDING}
                                className="relative px-5 py-2 text-xs font-medium rounded-sm transition-colors data-[selected=true]:text-white text-gray-500 flex flex-col items-center justify-center leading-tight min-h-12"
                            >
                                Pending (12)
                                <Tabs.Indicator className="bg-[#6f4e37] rounded-sm" />
                            </Tabs.Tab>

                            <Separator orientation="vertical" className="bg-[#6f4e37]" />

                            <Tabs.Tab
                                id={RestaurantVerifyStatus.APPROVED}
                                className="relative px-5 py-2 text-xs font-medium rounded-sm transition-colors data-[selected=true]:text-white text-gray-500 flex flex-col items-center justify-center leading-tight min-h-12"
                            >
                                Approved (124)
                                <Tabs.Indicator className="bg-[#6f4e37] rounded-sm" />
                            </Tabs.Tab>

                            <Separator orientation="vertical" className="bg-[#6f4e37]" />

                            <Tabs.Tab
                                id={RestaurantVerifyStatus.REJECTED}
                                className="relative px-5 py-2 text-xs font-medium rounded-sm transition-colors data-[selected=true]:text-white text-gray-500 flex flex-col items-center justify-center leading-tight min-h-12"
                            >
                                Rejected (9)
                                <Tabs.Indicator className="bg-[#6f4e37] rounded-sm" />
                            </Tabs.Tab>
                        </Tabs.List>
                    </Tabs.ListContainer>
                </Tabs>
            </div>
        </CustomCard>
    );
}

export default PendingStatusTabs;
