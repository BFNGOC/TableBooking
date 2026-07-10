'use client';

import { useGetMe } from '@/features/users/hooks/useGetMe';
import { useToast } from '@/shared/hooks/useToast';
import { useSession } from 'next-auth/react';

function CustomerHomePage() {
    const { showToast } = useToast();

    const { data: session } = useSession();

    const { data } = useGetMe();

    console.log('User data in CustomerHomePage:', data?.name);

    return (
        <div className="flex gap-5">
            <button
                onClick={() => {
                    showToast('success', 'Đăng nhập thành công', 'Chào mừng bạn quay trở lại');
                }}
            >
                success
            </button>
            <button
                onClick={() => {
                    showToast('error', 'Đăng nhập thất bại', 'Sai email hoặc mật khẩu');
                }}
            >
                error
            </button>
            <button
                onClick={() => {
                    showToast('info', 'Đăng nhập thất bại', 'Sai email hoặc mật khẩu');
                }}
            >
                info
            </button>

            <div>{data?.name}</div>
            <div>{session?.user?.role}</div>
        </div>
    );
}

export default CustomerHomePage;
