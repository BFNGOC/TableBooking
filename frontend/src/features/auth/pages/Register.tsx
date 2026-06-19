'use client';

import LoginGoogleButton from '@/shared/components/buttons/LoginGoogleButton';
import FooterAuth from '../components/FooterAuth';
import CustomForm from '@/shared/components/form/CustomForm';
import { Button } from '@heroui/react';
import { registerFormFields } from '../constants/register-form-fields';
import { useToast } from '@/shared/hooks/useToast';
import { RegisterPayload } from '../types/auth.type';
import { registerApi } from '../api/auth-api';
import { useRouter } from 'next/navigation';

function Register() {
    const router = useRouter();
    const { showToast } = useToast();

    const handleSubmit = async (data: RegisterPayload) => {
        try {
            await registerApi(data);

            showToast('success', 'Đăng ký thành công', 'Chào mừng bạn đến với TableBooking');

            router.push('/verify-email/:id');
        } catch (error: any) {
            showToast('error', 'Đăng nhập thất bại', error?.message);
        }
    };

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
                <CustomForm
                    fields={registerFormFields}
                    onSubmit={handleSubmit}
                    footer={
                        <Button type="submit" className="w-full h-12 bg-[#6f4e37]">
                            Đăng ký
                        </Button>
                    }
                ></CustomForm>

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
