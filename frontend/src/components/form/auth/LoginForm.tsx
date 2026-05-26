'use client';

import DynamicForm from '@/components/form/DynamicForm';

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

    const handleSubmit = (data: Record<string, string>) => {
        console.log(data);
    };

    return <DynamicForm fields={fields} submitText="Đăng nhập" onSubmit={handleSubmit} />;
}

export default LoginForm;
