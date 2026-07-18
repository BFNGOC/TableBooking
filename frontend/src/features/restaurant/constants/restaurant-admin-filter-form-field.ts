import { FormField } from '@/shared/types/form-field';
import { FormFieldType } from '@/shared/types/form-field-types';

export const restaurantAdminFilterFormFields: FormField[] = [
    {
        name: 'taxCode',
        label: 'Mã số thuế',
        type: FormFieldType.TEXT,
        placeholder: 'Nhập mã số thuế',
        col: 4,
    },
];
