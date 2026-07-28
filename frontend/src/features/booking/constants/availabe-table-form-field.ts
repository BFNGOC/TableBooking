import { FormField } from '@/shared/types/form-field';
import { FormFieldType } from '@/shared/types/form-field-types';

export const availableTableFormField: FormField[] = [
    {
        name: 'date',
        label: 'Ngày đặt',
        type: FormFieldType.DATE_PICKER,
        isRequired: true,
        col: 3,
    },
    {
        name: 'startTime',
        label: 'Giờ đặt',
        type: FormFieldType.TIME_PICKER,
        isRequired: true,
        col: 3,
    },
    {
        name: 'guestCount',
        label: 'Số người',
        type: FormFieldType.NUMBER,
        isRequired: true,
        col: 3,
    },
];
