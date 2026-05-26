'use client';

import { NavItem } from '@/types/navigation';
import { Button } from '@heroui/react';
import { Link } from '@heroui/react';
import { usePathname } from 'next/navigation';

interface INavbarPublicProps {
    navItems: NavItem[];
}

function NavbarPublic({ navItems }: INavbarPublicProps) {
    const pathname = usePathname();

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
                <div className="flex items-center gap-3">
                    <Link href="/auth/login">
                        <Button variant="ghost" className="text-[#6f4e37]">
                            Đăng nhập
                        </Button>
                    </Link>

                    <Link href="/auth/register">
                        <Button className="bg-[#6f4e37] text-white">Đăng ký</Button>
                    </Link>
                </div>
            </div>
        </header>
    );
}

export default NavbarPublic;
