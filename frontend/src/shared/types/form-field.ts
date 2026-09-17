import { DateValue, TimeValue } from '@heroui/react';
import { FormFieldType } from './form-field-types';
import { FormModalModeType } from './form-modal-mode-type';
import { ReactNode } from 'react';

export interface FieldContext<T = Record<string, any>> {
    mode: FormModalModeType;
    dataForm: Partial<T>;
}

export interface options {
    id: any;
    text: string;
    description?: string;
}

export interface FormField {
    label?: string;
    name: string;

    type?: FormFieldType;

    className?: string;

    placeholder?: string;

    description?: string;

    col?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

    options?: options[];

    isDisabled?: boolean | ((context: FieldContext) => boolean);

    isReadOnly?: boolean | ((context: FieldContext) => boolean);

    hidden?: boolean | ((context: FieldContext) => boolean);

    isRequired?: boolean | ((context: FieldContext) => boolean);

    validate?: (value: any, values?: Record<string, any>) => string | null;

    defaultValue?: string;

    value?: any;

    onChange?: (value: any) => void;

    defaultDate?: DateValue;

    minValue?: DateValue | number;

    maxValue?: DateValue | number;

    defaultTime?: TimeValue;

    //image
    multiple?: boolean;

    maxFiles?: number;

    onLoadingChange?: (isLoading: boolean) => void;

    selectionMode?: 'single' | 'multiple';

    render?: (props: { value: any; field: FormField; onChange: (value: any) => void }) => ReactNode;
}

export type ResolvedFormField = Omit<
    FormField,
    'isDisabled' | 'isReadOnly' | 'isRequired' | 'hidden'
> & {
    isDisabled?: boolean;
    isReadOnly?: boolean;
    isRequired?: boolean;
    hidden?: boolean;
};

export type NumberFormField = Omit<ResolvedFormField, 'defaultValue' | 'minValue' | 'maxValue'> & {
    defaultValue?: number;
    minValue?: number;
    maxValue?: number;
};

export type DateFormField = Omit<ResolvedFormField, 'minValue' | 'maxValue'> & {
    minValue?: DateValue;
    maxValue?: DateValue;
};
