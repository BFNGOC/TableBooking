'use client';

import { useGetMe } from '@/features/users/hooks/useGetMe';
import { useToast } from '@/shared/hooks/useToast';

function HomePage() {
    const { showToast } = useToast();

    const { data } = useGetMe();

    console.log('User data in HomePage:', data);

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
        </div>
    );
}

export default HomePage;
