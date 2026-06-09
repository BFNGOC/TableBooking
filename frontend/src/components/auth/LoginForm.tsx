'use client';

import CustomForm from '@/components/form/CustomForm';
import { signIn } from 'next-auth/react';

function LoginForm() {
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
        console.log(data);

        const { email, password } = data;

        await signIn('credentials', { email, password, redirect: true, callbackUrl: '/' });
    };

    return <CustomForm fields={fields} submitText="Đăng nhập" onSubmit={handleSubmit} />;
}

export default LoginForm;
