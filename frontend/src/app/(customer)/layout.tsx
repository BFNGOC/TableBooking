import NavbarPublic from '@/shared/components/layouts/Navbar';
import type { ReactNode } from 'react';

interface PublicLayoutProps {
    children: ReactNode;
}
function PublicLayout({ children }: PublicLayoutProps) {
    const navItems = [
        {
            label: 'Khám phá',
            href: '/',
        },
        {
            label: 'Nhà hàng',
            href: '/restaurants',
        },
    ];

    return (
        <div className="flex min-h-screen flex-col">
            <div className="bg-[#e3d9d3]">
                <NavbarPublic navItems={navItems} />
            </div>

            <div className="flex-1 bg-[#f5efeb]">
                <main className="mx-auto w-full max-w-375 px-3 py-6 md:px-5 lg:px-6">
                    {children}
                </main>
            </div>
        </div>
    );
}

export default PublicLayout;
