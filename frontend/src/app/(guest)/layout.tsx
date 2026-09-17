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
                    src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4"
                    alt="Restaurant"
                    className="h-full w-full object-cover"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/45" />

                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-end p-12 text-white">
                    <h1 className="mb-4 max-w-md text-5xl font-bold leading-tight">
                        Trải nghiệm ẩm thực thượng lưu
                    </h1>

                    <p className="max-w-lg text-lg text-gray-200">
                        Đặt chỗ tại những nhà hàng đẳng cấp nhất với vài lượt chạm. Khám phá không
                        gian ẩm thực tinh hoa dành riêng cho bạn.
                    </p>
                </div>
            </div>

            {/* Right Content */}
            <div className="flex flex-1 items-center justify-center px-6 py-10">
                <div className="w-full max-w-md">{children}</div>
            </div>
        </div>
    );
}

export default AuthLayout;
