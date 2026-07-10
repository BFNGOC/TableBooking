'use client';

import UserAvatar from '@/shared/components/avatar/UserAvatar';
import SidebarLayout from '@/shared/components/layouts/Sidebar';
import { type ReactNode } from 'react';

interface RestaurantProps {
    children: ReactNode;
}

function Restaurant({ children }: RestaurantProps) {
    const menus = [
        {
            label: 'Tổng quan',
            href: '/restaurant/dashboard',
            exact: true,
        },
        {
            label: 'Đơn đặt bàn',
            href: '/restaurant/dashboard/bookings',
        },
        {
            label: 'Quản lý bàn',
            href: '/restaurant/dashboard/tables',
        },
        {
            label: <UserAvatar />,
            href: '/restaurant/dashboard/settings',
        },
    ];

    return (
        <div className="flex min-h-screen bg-[#f5efeb]">
            {/* Sidebar */}
            <SidebarLayout menus={menus} />

            {/* Content */}
            <main className="flex-1 p-6">{children}</main>
        </div>
    );
}

export default Restaurant;
