import { FormField } from '@/shared/types/form-field';
import { FormFieldType } from '@/shared/types/form-field-types';

export const verifyFormField: FormField[] = [
    {
        name: '_id',
        type: FormFieldType.TEXT,
        hidden: true,
        isReadOnly: true,
    },
    {
        name: 'code',
        label: 'Mã xác thực',
        type: FormFieldType.TEXT,
    },
];
