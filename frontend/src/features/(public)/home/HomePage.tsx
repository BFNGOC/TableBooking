'use client';

import { useToast } from '@/shared/hooks/useToast';

function HomePage() {
    const { showToast } = useToast();

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
        </div>
    );
}

export default HomePage;
