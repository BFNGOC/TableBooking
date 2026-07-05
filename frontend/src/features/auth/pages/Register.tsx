'use client';

import LoginGoogleButton from '@/shared/components/buttons/LoginGoogleButton';
import FooterAuth from '../components/FooterAuth';
import CustomForm from '@/shared/components/form/CustomForm';
import { Button } from '@heroui/react';
import { registerFormFields } from '../constants/register-form-fields';
import { useToast } from '@/shared/hooks/useToast';
import { RegisterPayload } from '../types/auth.type';
import { useRouter } from 'next/navigation';
import { useRegisterMutation } from '../hooks/useAuthMutations';
import { useState } from 'react';

function Register() {
    const router = useRouter();
    const { showToast } = useToast();
    const { mutateAsync: register, isPending } = useRegisterMutation();
    const [values, setValues] = useState<Partial<RegisterPayload>>({
        name: '',
        email: '',
        password: '',
    });

    const handleSubmit = async (data: Partial<RegisterPayload>) => {
        const payload: RegisterPayload = {
            name: data.name ?? '',
            email: data.email ?? '',
            password: data.password ?? '',
        };

        try {
            const res = await register(payload);

            if (res?.data?.user?._id) {
                showToast('success', 'Đăng ký thành công', 'Chào mừng bạn đến với TableBooking');
                router.push(`/verify-email/${res.data.user._id}`);
            }
        } catch (error: any) {
            showToast('error', 'Đăng nhập thất bại', error?.message);
        }
    };

    return (
        <div className="rounded-3xl bg-white p-8 shadow-sm">
            <div className="mb-6">
                <h1 className="mb-2 text-3xl font-bold text-gray-900">Tạo tài khoản</h1>

                <p className="text-gray-500">
                    Đăng ký để khám phá và đặt chỗ tại những nhà hàng tuyệt vời nhất.
                </p>
            </div>

            <div className="space-y-3">
                <CustomForm
                    fields={registerFormFields}
                    values={values}
                    onValuesChange={setValues}
                    onSubmit={handleSubmit}
                    footer={
                        <Button
                            type="submit"
                            className="w-full h-12 bg-[#6f4e37]"
                            isPending={isPending}
                        >
                            Đăng ký
                        </Button>
                    }
                />

                <LoginGoogleButton />
            </div>

            <div className="mt-6 space-y-3">
                <FooterAuth text="Đã có tài khoản?" href="/login" linkText="Đăng nhập" />
            </div>
        </div>
    );
}

export default Register;
