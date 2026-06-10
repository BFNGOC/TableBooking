'use client';

import CustomForm from '@/components/form/CustomForm';
import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState<string>('');

    // Kiểm tra error từ URL params khi trang load
    useEffect(() => {
        const urlError = searchParams.get('error');
        if (urlError === 'CredentialsSignin') {
            setError('Email hoặc mật khẩu không chính xác');
        } else if (urlError) {
            setError(`Lỗi đăng nhập: ${urlError}`);
        }
    }, [searchParams]);

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
        setError('');
        setSuccess('');

        const { email, password } = data;

        const result = await signIn('credentials', {
            email,
            password,
            redirect: false,
        });

        console.log('Login result:', result);

        if (result?.status === 401) {
            setError('Email hoặc mật khẩu không đúng');
        } else if (result?.status === 400) {
            setError('Tài khoản chưa được kích hoạt');
            setTimeout(() => {
                router.push('/verify-email');
            }, 1000);
        } else if (result?.status === 200) {
            setSuccess('Đăng nhập thành công! Đang chuyển hướng...');
            setTimeout(() => {
                router.push('/');
            }, 1000);
        }
    };

    return (
        <div>
            {error && (
                <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
                    {error}
                </div>
            )}
            {success && (
                <div className="mb-4 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-600">
                    {success}
                </div>
            )}
            <CustomForm fields={fields} submitText="Đăng nhập" onSubmit={handleSubmit} />
        </div>
    );
}

export default LoginForm;
