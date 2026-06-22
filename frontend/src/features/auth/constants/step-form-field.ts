import { FormField } from '@/shared/types/form-field';
import { FormFieldType } from '@/shared/types/form-field-types';

export const step1field: FormField[] = [
    {
        name: 'email',
        label: 'Tài khoản của bạn chưa được kích hoạt',
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
export const step2field: FormField[] = [
    {
        name: 'code',
        label: 'Tài khoản của bạn chưa được kích hoạt',
        type: FormFieldType.TEXT,
        placeholder: 'ede7d037-1652-4856-827a-17efd37679c4',
    },
];
