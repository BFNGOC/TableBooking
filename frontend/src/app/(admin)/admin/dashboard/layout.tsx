'use client';

import SidebarLayout from '@/shared/components/layouts/Sidebar';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, type ReactNode } from 'react';

interface AdminLayoutProps {
    children: ReactNode;
}

function AdminLayout({ children }: AdminLayoutProps) {
    const { data } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (data?.user?.role !== 'ADMIN') {
            router.replace('/');
        }
    }, [data]);

    const menus = [
        {
            label: 'Tổng quan',
            href: '/admin/dashboard',
            exact: true,
        },
        {
            label: 'Nhà hàng',
            href: '/admin/dashboard/restaurants',
        },
        {
            label: 'Người dùng',
            href: '/admin/dashboard/users',
        },
        {
            label: 'Cài đặt',
            href: '/admin/dashboard/settings',
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
