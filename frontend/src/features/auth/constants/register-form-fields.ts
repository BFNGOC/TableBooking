import { FormField } from '@/shared/types/form-field';
import { FormFieldType } from '@/shared/types/form-field-types';

export const registerFormFields: FormField[] = [
    {
        name: 'name',
        label: 'Họ và tên',
        type: FormFieldType.TEXT,
        placeholder: 'Nguyễn Văn A',
        isRequired: true,
    },
    {
        name: 'email',
        label: 'Email',
        type: FormFieldType.EMAIL,
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
        type: FormFieldType.PASSWORD,
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
