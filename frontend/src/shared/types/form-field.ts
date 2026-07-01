import { DateValue, TimeValue } from '@heroui/react';
import { FormFieldType } from './form-field-types';
import { FormModalModeType } from './form-modal-mode-type';

export interface FieldContext {
    mode: FormModalModeType;
}

export interface FormField {
    label?: string;
    name: string;

    type?: FormFieldType;

    className?: string;

    placeholder?: string;

    col?: 1 | 2 | 3 | 4 | 5 | 6 | 12;

    options?: {
        id: string;
        text: string;
    }[];

    isDisabled?: any;

    hidden?: any;

    isReadOnly?: any;

    isRequired?: boolean;

    validate?: (value: string) => string | null;

    defaultValue?: string;

    defaultDate?: DateValue;

    minValue?: DateValue;

    maxValue?: DateValue;

    defaultTime?: TimeValue;
}
