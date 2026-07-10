'use client';

import { NavItem } from '@/shared/types/navigation';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

interface SidebarItemProps {
    item: NavItem;
    level?: number;
}

function SidebarItem({ item, level = 0 }: SidebarItemProps) {
    const pathname = usePathname();

    const hasChildren = !!item.children?.length;

    /**
     * Activates itself
     */
    const isActive = useMemo(() => {
        if (!item.href) return false;

        if (item.exact) {
            return pathname === item.href;
        }

        return pathname === item.href || pathname.startsWith(item.href + '/');
    }, [item.exact, item.href, pathname]);

    /**
     * Is there any active child?
     */
    const hasActiveChild = useMemo(() => {
        if (!hasChildren) return false;

        return item.children!.some((child) => {
            if (!child.href) return false;

            if (child.exact) {
                return pathname === child.href;
            }

            return pathname === child.href || pathname.startsWith(child.href + '/');
        });
    }, [hasChildren, item.children, pathname]);

    /**
     * Automatically expand if there is an active child
     */
    const [open, setOpen] = useState(hasActiveChild);

    useEffect(() => {
        if (hasActiveChild) {
            setOpen(true);
        }
    }, [hasActiveChild]);

    /**
     * Standard menu
     */
    if (!hasChildren) {
        return (
            <Link
                href={item.href ?? '#'}
                className={`block rounded-lg px-4 py-3 font-medium transition ${
                    isActive
                        ? 'bg-[#f5efeb] text-[#6f4e37]'
                        : 'text-gray-700 hover:bg-[#f5efeb] hover:text-[#6f4e37]'
                }`}
                style={{
                    paddingLeft: `${16 + level * 20}px`,
                }}
            >
                <div className="flex items-center gap-2">
                    {item.icon}
                    {item.label}
                </div>
            </Link>
        );
    }

    /**
     * Parent menu
     */
    return (
        <div>
            <button
                type="button"
                onClick={() => setOpen((prev) => !prev)}
                className={`flex w-full items-center justify-between rounded-lg px-4 py-3 font-medium transition cursor-pointer ${
                    hasActiveChild
                        ? 'bg-[#efe7e2] text-[#6f4e37]'
                        : 'text-gray-700 hover:bg-[#f5efeb] hover:text-[#6f4e37]'
                }`}
                style={{
                    paddingLeft: `${16 + level * 20}px`,
                }}
            >
                <div className="flex items-center gap-2">
                    {item.icon}
                    {item.label}
                </div>

                <ChevronRight
                    size={18}
                    className={`transition-transform duration-200 ${open ? 'rotate-90' : ''}`}
                />
            </button>

            {open && (
                <div className="mt-1 flex flex-col gap-1">
                    {item.children!.map((child) => (
                        <SidebarItem
                            key={child.href ?? String(child.label)}
                            item={child}
                            level={level + 1}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default SidebarItem;
