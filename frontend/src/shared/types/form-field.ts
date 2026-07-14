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

    description?: string;

    col?: 1 | 2 | 3 | 4 | 5 | 6 | 12;

    options?: {
        id: any;
        text: string;
        description?: string;
    }[];

    isDisabled?: any;

    hidden?: any;

    isReadOnly?: any;

    isRequired?: boolean;

    validate?: (value: string) => string | null;

    defaultValue?: string;

    value?: any;

    onChange?: (value: any) => void;

    defaultDate?: DateValue;

    minValue?: DateValue;

    maxValue?: DateValue;

    defaultTime?: TimeValue;

    //image
    multiple?: boolean;

    maxFiles?: number;

    onLoadingChange?: (isLoading: boolean) => void;

    selectionMode?: 'single' | 'multiple';
}
