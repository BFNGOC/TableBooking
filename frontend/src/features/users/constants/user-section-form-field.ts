import { FormField } from '@/shared/types/form-field';
import { FormFieldType } from '@/shared/types/form-field-types';
import { formRules } from '@/shared/utils/form-rules';
import {
    USER_ACCOUNT_TYPE_OPTIONS,
    USER_GENDER_TYPE_OPTIONS,
    USER_ROLE_OPTIONS,
} from './user-options';

import { today, getLocalTimeZone } from '@internationalized/date';
import { FormModalMode } from '@/shared/types/form-modal-mode-type';

const todayDate = today(getLocalTimeZone());

export const userAccountFormField: FormField[] = [
    {
        name: 'name',
        label: 'Họ và tên',
        type: FormFieldType.TEXT,
        placeholder: 'Nguyễn Văn A',
        isRequired: true,
        validate: (value: string) => {
            if (!value) {
                return 'Họ và tên không được để trống';
            }
            return null;
        },
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
        isRequired: ({ mode }) => mode === FormModalMode.CREATE,
        validate: formRules.password,
        hidden: ({ mode }) => mode !== FormModalMode.CREATE,
    },
    {
        name: 'role',
        label: 'Vai trò',
        type: FormFieldType.SELECT,
        placeholder: 'Chọn vai trò',
        options: USER_ROLE_OPTIONS,
    },
    {
        name: 'accountType',
        label: 'Loại tài khoản',
        type: FormFieldType.SELECT,
        placeholder: 'Chọn loại tài khoản',
        options: USER_ACCOUNT_TYPE_OPTIONS,
    },
    {
        name: 'isActive',
        label: 'Trạng thái',
        type: FormFieldType.SELECT,
        placeholder: 'Chọn trạng thái',
        options: [
            { id: true, text: 'Kích hoạt' },
            { id: false, text: 'Vô hiệu hóa' },
        ],
    },
];

export const userProfileFormField: FormField[] = [
    {
        name: 'avatar',
        label: 'Ảnh đại diện',
        type: FormFieldType.IMAGE,
    },
    {
        name: 'phone',
        label: 'Số điện thoại',
        type: FormFieldType.TEXT,
        placeholder: '0123456789',
    },
    {
        name: 'address',
        label: 'Địa chỉ',
        type: FormFieldType.TEXT,
        placeholder: 'Khu A, HCM',
    },

    {
        name: 'gender',
        label: 'Giới tính',
        type: FormFieldType.SELECT,
        options: USER_GENDER_TYPE_OPTIONS,
    },
    {
        name: 'dateOfBirth',
        label: 'Ngày sinh',
        type: FormFieldType.DATE_PICKER,
        placeholder: '2000/01/02',
        maxValue: todayDate,
    },
];

export const userProfileRoleUserFormField: FormField[] = [
    {
        name: 'avatar',
        label: 'Ảnh đại diện',
        type: FormFieldType.IMAGE,
        col: 12,
    },
    {
        name: 'name',
        label: 'Họ và tên',
        type: FormFieldType.TEXT,
        placeholder: 'Nguyễn Văn A',
        isRequired: true,
        col: 6,
        validate: (value: string) => {
            if (!value) {
                return 'Họ và tên không được để trống';
            }
            return null;
        },
    },
    {
        name: 'email',
        label: 'Email',
        type: FormFieldType.EMAIL,
        placeholder: 'name@example.com',
        isRequired: true,
        isDisabled: true,
        col: 6,
        validate: (value: string) => {
            if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
                return 'Email không hợp lệ';
            }

            return null;
        },
    },
    {
        name: 'phone',
        label: 'Số điện thoại',
        type: FormFieldType.TEXT,
        placeholder: '0123456789',
        col: 6,
    },

    {
        name: 'dateOfBirth',
        label: 'Ngày sinh',
        type: FormFieldType.DATE_PICKER,
        placeholder: '2000/01/02',
        maxValue: todayDate,
        col: 6,
    },

    {
        name: 'gender',
        label: 'Giới tính',
        type: FormFieldType.SELECT,
        options: USER_GENDER_TYPE_OPTIONS,
        col: 6,
    },
    {
        name: 'address',
        label: 'Địa chỉ',
        type: FormFieldType.TEXT,
        placeholder: 'Khu A, HCM',
        col: 12,
    },
];
