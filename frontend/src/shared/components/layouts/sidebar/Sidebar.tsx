'use client';

import Link from 'next/link';
import { NavItem } from '@/shared/types/navigation';
import SidebarItem from './SidebarItem';
import SidebarFooter from './SidebarFooter';

interface SidebarProps {
    menus: NavItem[];
    logo?: React.ReactNode;
}

function Sidebar({ menus, logo }: SidebarProps) {
    return (
        <aside className="flex h-screen w-64 shrink-0 flex-col border-r border-gray-200 bg-[#e3d9d3] p-4">
            {/* Logo */}
            <Link href="/" className="mb-8 block shrink-0 text-2xl font-bold text-[#6f4e37]">
                {logo ?? 'TableBooking'}
            </Link>

            {/* Menu */}
            <nav className="min-h-0 flex-1 overflow-y-auto pr-1">
                <div className="flex flex-col gap-2">
                    {menus.map((menu) => (
                        <SidebarItem key={menu.href ?? String(menu.label)} item={menu} />
                    ))}
                </div>
            </nav>

            {/* Footer */}
            <div className="shrink-0 border-t border-gray-300 p-4">
                <SidebarFooter />
            </div>
        </aside>
    );
}

export default Sidebar;
