import { FormFieldType } from './form-field-types';

export interface FormField {
    label?: string;
    name: string;

    type?: FormFieldType;

    placeholder?: string;

    col?: 1 | 2 | 3 | 4 | 5 | 6 | 12;

    options?: {
        label: string;
        value: string;
    }[];

    isDisabled?: boolean;

    hidden?: boolean;

    isReadOnly?: boolean;

    isRequired?: boolean;

    validate?: (value: string) => string | null;

    defaultValue?: string;
}
