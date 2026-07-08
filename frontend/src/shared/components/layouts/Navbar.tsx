'use client';

import { NavItem } from '@/shared/types/navigation';
import { Button } from '@heroui/react';
import { Link } from '@heroui/react';
import { signOut, useSession } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import { Home, LogOut, Settings, User, CalendarDays, CircleHelp } from 'lucide-react';
import UserAvatar from '../avatar/UserAvatar';
import DropDownCustom from '../dropdown/DropdownCustom';
import { useToast } from '@/shared/hooks/useToast';

interface INavbarPublicProps {
    navItems: NavItem[];
}

function NavbarPublic({ navItems }: INavbarPublicProps) {
    const { data: session } = useSession();
    const router = useRouter();

    const { showToast } = useToast();

    const pathname = usePathname();

    const dropdownItems = [
        {
            id: 'user',
            label: <UserAvatar />,
        },
        {
            id: 'home',
            label: 'Trang chủ',
            icon: <Home size={16} />,
            onAction: () => router.push('/'),
        },
        {
            id: 'booking',
            label: 'Đặt bàn của tôi',
            icon: <CalendarDays size={16} />,
            onAction: () => router.push('/reservations'),
        },
        {
            id: 'profile',
            label: 'Thông tin cá nhân',
            icon: <User size={16} />,
            onAction: () => router.push('/settings'),
        },
        {
            id: 'change-password',
            label: 'Cài đặt',
            icon: <Settings size={16} />,
            onAction: () => router.push('/settings?tab=security'),
        },
        {
            id: 'support',
            label: 'Hỗ trợ',
            icon: <CircleHelp size={16} />,
            onAction: () => router.push('/support'),
        },
        {
            id: 'logout',
            label: 'Đăng xuất',
            variant: 'danger' as const,
            icon: <LogOut size={16} />,
            onAction: async () => {
                await signOut({ callbackUrl: '/' });
                showToast('success', 'Đăng xuất thành công');
            },
        },
    ];

    return (
        <header className="border-b border-gray-200">
            <div className="mx-auto flex h-16 max-w-375 items-center justify-between px-6">
                {/* Logo */}
                <Link href="/" className="text-3xl font-bold text-[#6f4e37]">
                    TableBooking
                </Link>

                {/* Menu */}
                <nav className="hidden items-center gap-8 md:flex">
                    {navItems.map((item) => {
                        const isActive =
                            item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`border-b-2 pb-1 font-medium transition no-underline ${
                                    isActive
                                        ? 'border-[#6f4e37] text-[#6f4e37]'
                                        : 'border-transparent text-gray-700 hover:text-[#6f4e37]'
                                }`}
                            >
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                {/* Actions */}
                {session?.user ? (
                    <DropDownCustom items={dropdownItems as any} trigger={<UserAvatar />} />
                ) : (
                    <div className="flex items-center gap-3">
                        <Link href="/login">
                            <Button variant="ghost" className="text-[#6f4e37]">
                                Đăng nhập
                            </Button>
                        </Link>

                        <Link href="/register">
                            <Button className="bg-[#6f4e37] text-white">Đăng ký</Button>
                        </Link>
                    </div>
                )}
            </div>
        </header>
    );
}

export default NavbarPublic;
