'use client';

import CustomForm from '@/components/form/CustomForm';
import { sendRequest } from '@/utils/api';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { ILoginResponse } from './types/auth.type';

function LoginForm() {
    const router = useRouter();

    const fields = [
        {
            name: 'email',
            label: 'Email',
            type: 'email',
            placeholder: 'name@example.com',
            isRequired: true,
            validate: (value: string) => {
                if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
                    return 'Email không hợp lệ';
                }

                return null;
            },
        },

        {
            name: 'password',
            label: 'Mật khẩu',
            type: 'password',
            placeholder: '••••••••',
            isRequired: true,
            validate: (value: string) => {
                if (value.length < 6) {
                    return 'Mật khẩu tối thiểu 6 ký tự';
                }

                return null;
            },
        },
    ];

    const handleSubmit = async (data: Record<string, string>) => {
        try {
            const res = await sendRequest<ILoginResponse>({
                url: '/auth/login',
                method: 'POST',
                body: data,
            });

            const result = await signIn('credentials', {
                redirect: false,

                accessToken: res.data!.access_token,
                // refreshToken: res.data!.refresh_token,

                user: JSON.stringify(res.data!.user),
            });

            if (result?.error) {
                console.log(result.error);
                return;
            }

            router.push('/');
        } catch (error: any) {
            console.log(error.message);
        }
    };

    return (
        <div>
            {/* {error && (
                <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
                    {error}
                </div>
            )}
            {success && (
                <div className="mb-4 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-600">
                    {success}
                </div>
            )} */}
            <CustomForm fields={fields} submitText="Đăng nhập" onSubmit={handleSubmit} />
        </div>
    );
}

export default LoginForm;
