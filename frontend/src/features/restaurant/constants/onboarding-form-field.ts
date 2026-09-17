import { FormField } from '@/shared/types/form-field';
import { FormFieldType } from '@/shared/types/form-field-types';
import { formRules } from '@/shared/utils/form-rules';

interface Option {
    id: string;
    text: string;
}

export const createOnboardingFormField = (cuisineOptions: Option[]): FormField[] => [
    {
        name: 'restaurantName',
        label: 'Tên nhà hàng',
        type: FormFieldType.TEXT,
        placeholder: 'Nhập tên chính thức của nhà hàng',
        isRequired: true,
    },
    {
        name: 'cuisineTypes',
        label: 'Loại hình ẩm thực',
        type: FormFieldType.AUTOCOMPLETE,
        placeholder: 'Chọn loại hình',
        selectionMode: 'multiple',
        isRequired: true,
        options: cuisineOptions,
        col: 6,
    },
    {
        name: 'phone',
        label: 'Số điện thoại',
        type: FormFieldType.TEXT,
        placeholder: '0xxxxxxxxx',
        isRequired: true,
        validate: formRules.phone,
        col: 6,
    },
    {
        name: 'address',
        label: 'Địa chỉ kinh doanh',
        type: FormFieldType.TEXT,
        placeholder: 'Số nhà, tên đường, quận/huyện, thành phố',
        isRequired: true,
    },
    {
        name: 'representativeName',
        label: 'Tên người đại hiện',
        type: FormFieldType.TEXT,
        placeholder: 'Họ và tên',
        isRequired: true,
        col: 6,
    },
    {
        name: 'email',
        label: 'Email liên hệ',
        type: FormFieldType.EMAIL,
        placeholder: 'email@nhahang.com',
        isRequired: true,
        validate: formRules.email,
        col: 6,
    },
    {
        name: 'taxCode',
        label: 'Mã số thuế',
        type: FormFieldType.TEXT,
        placeholder: 'xxxxxxxxxx',
        isRequired: true,
    },
];
