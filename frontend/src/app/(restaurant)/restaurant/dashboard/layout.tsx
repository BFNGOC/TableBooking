'use client';

import SidebarLayout from '@/shared/components/layouts/sidebar/Sidebar';
import { NavItem } from '@/shared/types/navigation';
import { type ReactNode } from 'react';

interface RestaurantProps {
    children: ReactNode;
}

function Restaurant({ children }: RestaurantProps) {
    const menus: NavItem[] = [
        {
            label: 'Tổng quan',
            href: '/restaurant/dashboard',
            exact: true,
        },
        {
            label: 'Quản lý nhà hàng',
            children: [
                {
                    label: 'Thông tin',
                    href: '/restaurant/dashboard/profile',
                },
                {
                    label: 'Quản lý bàn',
                    children: [
                        {
                            label: 'Danh sách bàn',
                            href: '/restaurant/dashboard/tables',
                        },
                        {
                            label: 'Loại bàn',
                            href: '/restaurant/dashboard/tables/types',
                        },
                    ],
                },
                {
                    label: 'Menu',
                    children: [
                        {
                            label: 'Danh mục',
                            href: '/restaurant/dashboard/menu/categories',
                        },
                        {
                            label: 'Món ăn',
                            href: '/restaurant/dashboard/menu/items',
                        },
                        {
                            label: 'Combo',
                            href: '/restaurant/dashboard/menu/combos',
                        },
                    ],
                },
            ],
        },
        {
            label: 'Đơn đặt bàn',
            children: [
                {
                    label: 'Hôm nay',
                    href: '/restaurant/dashboard/bookings',
                },
                {
                    label: 'Lịch sử',
                    href: '/restaurant/dashboard/bookings/history',
                },
            ],
        },
        {
            label: 'Tài khoản',
            children: [
                {
                    label: 'Thông tin',
                    href: '/restaurant/dashboard/settings',
                },
                {
                    label: 'Đổi mật khẩu',
                    href: '/restaurant/dashboard/security',
                },
            ],
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
