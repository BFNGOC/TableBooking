'use client';

import SidebarLayout from '@/shared/components/layouts/Sidebar';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, type ReactNode } from 'react';

interface OwnerLayoutProps {
    children: ReactNode;
}

function OwnerLayout({ children }: OwnerLayoutProps) {
    const { data } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (data?.user?.role !== 'RESTAURANT') {
            router.replace('/');
        }
    }, [data]);

    const menus = [
        {
            label: 'Tổng quan',
            href: '/owner/dashboard',
            exact: true,
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
