import type { ReactNode } from 'react';
import SidebarLayout from '@/components/layouts/Sidebar';

interface OwnerLayoutProps {
    children: ReactNode;
}

function OwnerLayout({ children }: OwnerLayoutProps) {
    const menus = [
        {
            label: 'Tổng quan',
            href: '/owner/dashboard',
        },
        {
            label: 'Đơn đặt bàn',
            href: '/owner/dashboard/bookings',
        },
        {
            label: 'Quản lý bàn',
            href: '/owner/dashboard/tables',
        },
        {
            label: 'Cài đặt',
            href: '/owner/dashboard/settings',
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

export default OwnerLayout;
