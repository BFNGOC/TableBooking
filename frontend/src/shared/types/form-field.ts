import { FormFieldType } from './form-field-types';
import { FormModalModeType } from './form-modal-mode-type';

export interface FieldContext {
    mode: FormModalModeType;
}

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

    isDisabled?: any;

    hidden?: any;

    isReadOnly?: any;

    isRequired?: boolean;

    validate?: (value: string) => string | null;

    defaultValue?: string;
}
