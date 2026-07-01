import { FormField } from '@/shared/types/form-field';
import { FormFieldType } from '@/shared/types/form-field-types';
import { USER_ROLE_OPTIONS } from './user-role-options';
import { CalendarDate } from '@internationalized/date';

const today = new CalendarDate(
    new Date().getFullYear(),
    new Date().getMonth() + 1,
    new Date().getDate()
);
const minDate = new CalendarDate(2026, 7, 15);

export const userFilterFormFields: FormField[] = [
    {
        name: 'keySearch',
        label: 'Họ tên hoặc email',
        type: FormFieldType.TEXT,
        placeholder: 'Nhập họ tên hoặc email cần tìm kiếm',
        col: 6,
    },
    {
        name: 'role',
        label: 'Vai trò',
        type: FormFieldType.SELECT,
        placeholder: 'Chọn vai trò',
        options: USER_ROLE_OPTIONS,
        col: 6,
    },
];
