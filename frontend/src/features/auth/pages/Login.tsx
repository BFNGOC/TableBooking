'use client';

import LoginGoogleButton from '@/shared/components/buttons/LoginGoogleButton';
import FooterAuth from '../components/FooterAuth';
import CustomForm from '@/shared/components/form/CustomForm';
import { useRouter } from 'next/navigation';
import { getSession, signIn } from 'next-auth/react';
import { useToast } from '@/shared/hooks/useToast';
import { LoginPayload } from '../types/auth.type';
import { Button, Link } from '@heroui/react';
import { useLoginMutation } from '../hooks/useAuthMutations';
import { loginFormFields } from '../constants/login-form-fields';
import ResendEmail from '../components/ResendEmail';
import { useFormModal } from '@/shared/hooks/useFormModal';
import ForgotPassword from '../components/ForgotPassword';
import { useState } from 'react';
import { getRedirectPathByRole } from '../utils/redireact-path-role';

function Login() {
    const router = useRouter();
    const { showToast } = useToast();
    const resendModal = useFormModal();
    const forgotModal = useFormModal();
    const { mutateAsync: login, isPending } = useLoginMutation();
    const [values, setValues] = useState<Partial<LoginPayload>>({
        email: '',
        password: '',
    });

    const handleSubmit = async (data: Partial<LoginPayload>) => {
        const payload: LoginPayload = {
            email: data.email ?? '',
            password: data.password ?? '',
        };

        try {
            const res = await login(payload);

            const result = await signIn('credentials', {
                redirect: false,
                accessToken: res.data!.access_token,
                user: JSON.stringify(res.data!.user),
            });

            if (result?.error) {
                return;
            }

            const session = await getSession();
            const redirectPath = getRedirectPathByRole(session?.user?.role as string | undefined);

            showToast('success', 'Đăng nhập thành công', 'Chào mừng bạn quay trở lại');
            router.replace(redirectPath);
        } catch (error: any) {
            if (error?.statusCode == 400) {
                resendModal.openView(payload.email);
                return;
            }
            showToast('error', 'Đăng nhập thất bại', error?.message);
        }
    };

    return (
        <div className="rounded-3xl bg-white p-8 shadow-sm">
            <div className="mb-8">
                <p className="mb-3 text-3xl font-bold text-[#6f4e37]">TableSpot</p>

                <h1 className="mb-2 text-2xl font-bold text-gray-900">Chào mừng trở lại</h1>

                <p className="text-gray-500">Vui lòng đăng nhập để tiếp tục trải nghiệm.</p>
            </div>

            <div className="space-y-3">
                <CustomForm
                    fields={loginFormFields}
                    values={values}
                    onValuesChange={setValues}
                    onSubmit={handleSubmit}
                    footer={
                        <Button
                            type="submit"
                            className="w-full h-12 bg-[#6f4e37]"
                            isPending={isPending}
                        >
                            Đăng nhập
                        </Button>
                    }
                />

                <LoginGoogleButton />
            </div>

            <div className="mt-6 space-y-3">
                <p className="text-center text-sm text-gray-500">
                    <Link className="font-semibold text-[#6f4e37]" onClick={forgotModal.openCreate}>
                        Quên mật khẩu
                    </Link>
                </p>
                <FooterAuth text="Chưa có tài khoản?" href="/register" linkText="Đăng ký" />
            </div>

            <ForgotPassword open={forgotModal.open} close={forgotModal.close} />

            <ResendEmail
                open={resendModal.open}
                close={resendModal.close}
                defaultEmail={resendModal.selectedRecord}
                mode={resendModal.mode}
            />
        </div>
    );
}

export default Login;
