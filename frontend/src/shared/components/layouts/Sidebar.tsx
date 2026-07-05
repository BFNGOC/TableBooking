'use client';

import { NavItem } from '@/shared/types/navigation';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface ISidebarPublicProps {
    menus: NavItem[];
}

function SidebarLayout({ menus }: ISidebarPublicProps) {
    const pathname = usePathname();

    return (
        <aside className="w-64 border-r border-gray-200 bg-[#e3d9d3] p-4">
            {/* Logo */}
            <Link href="/owner/dashboard" className="mb-8 block text-2xl font-bold text-[#6f4e37]">
                TableBooking
            </Link>

            {/* Menu */}
            <nav className="flex flex-col gap-2">
                {menus.map((menu) => {
                    const isActive = menu.exact
                        ? pathname === menu.href
                        : pathname === menu.href || pathname.startsWith(menu.href + '/');

                    return (
                        <Link
                            key={menu.href}
                            href={menu.href}
                            className={`block w-full rounded-lg px-4 py-3 font-medium transition ${
                                isActive
                                    ? 'bg-[#f5efeb] text-[#6f4e37]'
                                    : 'text-gray-700 hover:bg-[#f5efeb] hover:text-[#6f4e37]'
                            }`}
                        >
                            {menu.label}
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
}

export default SidebarLayout;
