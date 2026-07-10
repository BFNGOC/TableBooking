'use client';

import SidebarLayout from '@/shared/components/layouts/sidebar/Sidebar';
import { NavItem } from '@/shared/types/navigation';
import { type ReactNode } from 'react';

interface AdminLayoutProps {
    children: ReactNode;
}

function AdminLayout({ children }: AdminLayoutProps) {
    const menus: NavItem[] = [
        {
            label: 'Tổng quan',
            href: '/admin/dashboard',
            exact: true,
        },
        {
            label: 'Nhà hàng',
            children: [
                {
                    label: 'Danh sách',
                    href: '/admin/dashboard/restaurants',
                },
                {
                    label: 'Chờ duyệt',
                    href: '/admin/dashboard/restaurants/pending',
                },
            ],
        },
        {
            label: 'Người dùng',
            href: '/admin/dashboard/users',
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

export default AdminLayout;
