import LoginGoogleButton from '@/components/buttons/LoginGoogleButton';
import LoginForm from './LoginForm';
import FooterAuth from './FooterAuth';

function Login() {
    return (
        <div className="rounded-3xl bg-white p-8 shadow-sm">
            <div className="mb-8">
                <p className="mb-3 text-3xl font-bold text-[#6f4e37]">TableSpot</p>

                <h1 className="mb-2 text-2xl font-bold text-gray-900">Chào mừng trở lại</h1>

                <p className="text-gray-500">Vui lòng đăng nhập để tiếp tục trải nghiệm.</p>
            </div>

            <div className="space-y-3">
                <LoginForm />

                <LoginGoogleButton />
            </div>

            <div className="mt-6 space-y-3">
                <FooterAuth href="/forgot-password" linkText="Quên mật khẩu" />
                <FooterAuth text="Chưa có tài khoản?" href="/register" linkText="Đăng ký" />
            </div>
        </div>
    );
}

export default Login;
