import LoginGoogleButton from '@/components/buttons/LoginGoogleButton';
import FooterAuth from './FooterAuth';
import RegisterForm from './RegisterForm';

function Register() {
    return (
        <div className="rounded-3xl bg-white p-8 shadow-sm">
            {/* Header */}
            <div className="mb-6">
                <h1 className="mb-2 text-3xl font-bold text-gray-900">Tạo tài khoản</h1>

                <p className="text-gray-500">
                    Đăng ký để khám phá và đặt chỗ tại những nhà hàng tuyệt vời nhất.
                </p>
            </div>

            {/* Form */}
            <div className="space-y-3">
                <RegisterForm />

                <LoginGoogleButton />
            </div>

            {/* Footer */}

            <div className="mt-6 space-y-3">
                <FooterAuth text="Đã có tài khoản?" href="/login" linkText="Đăng nhập" />
            </div>
        </div>
    );
}

export default Register;
