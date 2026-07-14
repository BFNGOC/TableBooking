import { FormField } from '@/shared/types/form-field';
import { FormFieldType } from '@/shared/types/form-field-types';
import { USER_ROLE_OPTIONS } from './user-options';

export const userFilterFormFields: FormField[] = [
    {
        name: 'keySearch',
        label: 'Họ tên hoặc email',
        type: FormFieldType.TEXT,
        placeholder: 'Nhập họ tên hoặc email cần tìm kiếm',
        col: 4,
    },
    {
        name: 'role',
        label: 'Vai trò',
        type: FormFieldType.SELECT,
        placeholder: 'Chọn vai trò',
        options: USER_ROLE_OPTIONS,
        col: 4,
    },
    {
        name: 'isActive',
        label: 'Trạng thái',
        type: FormFieldType.SELECT,
        placeholder: 'Chọn trạng thái',
        options: [
            { id: 'true', text: 'Kích hoạt' },
            { id: 'false', text: 'Vô hiệu hóa' },
        ],
        col: 4,
    },
];
