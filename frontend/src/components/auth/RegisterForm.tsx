'use client';

import CustomForm from '@/components/form/CustomForm';

function RegisterForm() {
    const fields = [
        {
            name: 'fullName',
            label: 'Họ và tên',
            placeholder: 'Nguyễn Văn A',
            isRequired: true,
        },
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

    return <CustomForm fields={fields} submitText="Đăng ký" onSubmit={handleSubmit} />;
}

export default RegisterForm;
