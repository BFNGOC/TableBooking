import { FormField } from '@/shared/types/form-field';
import { FormFieldType } from '@/shared/types/form-field-types';
import { passwordRegex } from '@/shared/utils/password-regex';

export const getEmailField = (label: string): FormField[] => [
    {
        name: 'email',
        label,
        type: FormFieldType.EMAIL,
        placeholder: 'name@example.com',
        validate: (value: string) => {
            if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
                return 'Email không hợp lệ';
            }

            return null;
        },
    },
];

export const getOtpField = (label: string): FormField[] => [
    {
        name: 'code',
        label,
        type: FormFieldType.TEXT,
        placeholder: 'Nhập mã OTP',
    },
];

export const changePasswordField: FormField[] = [
    {
        name: 'code',
        label: 'Nhập mã OTP',
        type: FormFieldType.TEXT,
        placeholder: 'Nhập mã OTP',
        isRequired: true,
    },
    {
        name: 'password',
        label: 'Mật khẩu mới',
        type: FormFieldType.PASSWORD,
        placeholder: '••••••••',
        isRequired: true,
        validate: (value: string) => {
            if (value.length < 6) {
                return 'Mật khẩu tối thiểu 6 ký tự';
            }
            if (!passwordRegex.test(value)) {
                return 'Mật khẩu phải chứa chữ hoa, chữ thường, số và ký tự đặc biệt';
            }

            return null;
        },
    },
    {
        name: 'confirmPassword',
        label: 'Xác nhận mật khẩu',
        type: FormFieldType.PASSWORD,
        placeholder: '••••••••',
        isRequired: true,
        validate: (value: string) => {
            if (value.length < 6) {
                return 'Mật khẩu tối thiểu 6 ký tự';
            }
            if (!passwordRegex.test(value)) {
                return 'Mật khẩu phải chứa chữ hoa, chữ thường, số và ký tự đặc biệt';
            }

            return null;
        },
    },
];
