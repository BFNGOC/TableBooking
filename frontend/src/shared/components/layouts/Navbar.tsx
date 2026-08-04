'use client';

import { Button, Skeleton } from '@heroui/react';
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import { Home, LogOut, Settings, User, CalendarDays, Store, ShieldUser } from 'lucide-react';
import UserAvatar from '../avatar/UserAvatar';
import DropDownCustom, { DropdownItem } from '../dropdown/DropdownCustom';
import { useToast } from '@/shared/hooks/useToast';
import { useAuth } from '@/shared/hooks/useAuth';

interface INavbarPublicProps {
    navItems: { label: string; href: string }[];
}

function NavbarPublic({ navItems }: INavbarPublicProps) {
    const { user, isAuthLoading } = useAuth();

    const router = useRouter();

    const { showToast } = useToast();

    const pathname = usePathname();

    const dropdownItems: DropdownItem[] = [
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
            onAction: () => router.push('/my-bookings'),
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
            id: 'restaurant',
            label: 'Đăng ký nhà hàng',
            icon: <Store size={16} />,
            onAction: () => router.push('/restaurant-onboarding'),
            role: ['CUSTOMER'],
        },
        {
            id: 'restaurantDashboard',
            label: 'Đi tới trang chủ nhà hàng',
            icon: <Store size={16} />,
            onAction: () => router.push('/restaurant/dashboard'),
            role: ['RESTAURANT'],
        },
        {
            id: 'adminDashboard',
            label: 'Đi tới trang chủ admin',
            icon: <ShieldUser size={16} />,
            onAction: () => router.push('/admin/dashboard'),
            role: ['ADMIN'],
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
                {isAuthLoading ? (
                    <div className="flex items-center gap-3">
                        <Skeleton className="h-10 w-10 rounded-full" />

                        <div className="flex flex-col gap-2">
                            <Skeleton className="h-4 w-24 rounded-md" />
                            <Skeleton className="h-3 w-36 rounded-md" />
                        </div>
                    </div>
                ) : user ? (
                    <DropDownCustom items={dropdownItems as any} trigger={<UserAvatar />} />
                ) : (
                    <div className="flex items-center gap-3">
                        <Button
                            variant="ghost"
                            onPress={() => router.push('/login')}
                            className="text-[#6f4e37]"
                        >
                            Đăng nhập
                        </Button>

                        <Button
                            className="bg-[#6f4e37] text-white"
                            onPress={() => router.push('/register')}
                        >
                            Đăng ký
                        </Button>
                    </div>
                )}
            </div>
        </header>
    );
}

export default NavbarPublic;
