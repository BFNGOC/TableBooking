'use client';

import { useState } from 'react';
import { useRestaurantMe } from '@/features/restaurant/hooks/useRestaurantMe';
import {
    useGetMyAvailabilities,
    useGetAllTablesForRestaurant,
} from '../hooks/useTableAvailabilityCrud';
import { ITableAvailability } from '../types/table-availability.type';
import AvailabilityGroupSidebar from '../components/AvailabilityGroupSidebar';
import AvailabilityConfigPanel from '../components/AvailabilityConfigPanel';

export default function TableAvailabilityPage() {
    const { data: restaurant, isLoading: restaurantLoading } = useRestaurantMe();
    const restaurantId = restaurant?._id as string | undefined;

    const { data: schedules = [], isLoading: schedulesLoading } = useGetMyAvailabilities();
    const { tables, isLoading: tablesLoading } = useGetAllTablesForRestaurant(restaurantId);

    /** null = chế độ tạo mới; ITableAvailability = đang edit */
    const [selected, setSelected] = useState<ITableAvailability | null | 'new'>('new');

    const isLoading = restaurantLoading || schedulesLoading || tablesLoading;

    // Resolve the object to pass to the panel
    const panelSchedule: ITableAvailability | null =
        selected === 'new' ? null : (selected ?? null);

    const panelIndex =
        selected === 'new'
            ? schedules.length + 1
            : schedules.findIndex((s) => s._id === (selected as ITableAvailability)?._id) + 1;

    if (restaurantLoading) {
        return (
            <div className="flex h-full items-center justify-center">
                <div className="text-center">
                    <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-[#6f4e37] border-t-transparent" />
                    <p className="text-sm text-[#9a7a5f]">Đang tải thông tin nhà hàng...</p>
                </div>
            </div>
        );
    }

    if (!restaurantId) {
        return (
            <div className="flex h-full items-center justify-center">
                <p className="text-[#9a7a5f]">Không tìm thấy thông tin nhà hàng.</p>
            </div>
        );
    }

    return (
        <div className="flex h-full flex-col overflow-hidden">
            {/* ── Page header ── */}
            <div className="mb-4 flex-shrink-0">
                <h1 className="text-xl font-bold text-[#4a3728]">Cấu hình Khung giờ chung</h1>
                <p className="mt-0.5 text-sm text-[#9a7a5f]">
                    Quản lý tính khả dụng, khung giờ hàng tuần và các trường hợp ngoại lệ cho từng bàn tại nhà hàng của bạn.
                </p>
            </div>

            {/* ── Main layout: sidebar + panel ── */}
            <div className="flex min-h-0 flex-1 gap-4 overflow-hidden">
                {/* Left sidebar */}
                <aside className="w-64 flex-shrink-0 overflow-hidden rounded-2xl border border-[#e2ccb0] bg-white shadow-sm">
                    <AvailabilityGroupSidebar
                        schedules={schedules}
                        allTables={tables}
                        selectedId={
                            selected !== 'new' && selected !== null
                                ? (selected as ITableAvailability)._id
                                : undefined
                        }
                        onSelect={(sch) => setSelected(sch)}
                        onAdd={() => setSelected('new')}
                        isLoading={isLoading}
                    />
                </aside>

                {/* Right config panel */}
                <main className="min-w-0 flex-1 overflow-hidden rounded-2xl border border-[#e2ccb0] bg-white shadow-sm">
                    {isLoading ? (
                        <div className="flex h-full items-center justify-center">
                            <div className="text-center">
                                <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-[#6f4e37] border-t-transparent" />
                                <p className="text-sm text-[#9a7a5f]">Đang tải dữ liệu...</p>
                            </div>
                        </div>
                    ) : (
                        <AvailabilityConfigPanel
                            key={panelSchedule?._id ?? 'new'}
                            schedule={panelSchedule}
                            allTables={tables}
                            allSchedules={schedules}
                            scheduleIndex={panelIndex}
                            onSaved={(saved) => setSelected(saved)}
                            onDeleted={() => setSelected('new')}
                        />
                    )}
                </main>
            </div>
        </div>
    );
}
