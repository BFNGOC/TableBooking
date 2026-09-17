// app/(guest)/auth/layout.tsx

import type { ReactNode } from 'react';

interface AuthLayoutProps {
    children: ReactNode;
}

function AuthLayout({ children }: AuthLayoutProps) {
    return (
        <div className="flex min-h-screen bg-[#f5efeb]">
            {/* Left Banner */}
            <div className="relative hidden w-1/2 overflow-hidden lg:block">
                <img
                    src="https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1600&q=80"
                    alt="Restaurant"
                    className="h-full w-full object-cover"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/45" />

                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-end p-12 text-white">
                    <h1 className="mb-4 max-w-md text-5xl font-bold leading-tight">
                        Đồng hành cùng
                        <br />
                        TableBooking
                    </h1>

                    <p className="max-w-lg text-lg leading-8 text-gray-200">
                        Gia nhập hệ sinh thái TableBooking để tiếp cận nhiều thực khách hơn, quản lý
                        đặt bàn hiệu quả và nâng cao trải nghiệm vận hành nhà hàng trên một nền tảng
                        hiện đại.
                    </p>
                </div>
            </div>

            {/* Right Content */}
            <div className="flex flex-1 items-center justify-center px-6 py-10">
                <div className="w-full max-w-lg">{children}</div>
            </div>
        </div>
    );
}

export default AuthLayout;
