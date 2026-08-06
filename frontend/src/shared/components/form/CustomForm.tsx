'use client';

import { ReactNode, useState } from 'react';
import { Form } from '@heroui/react';
import AppTextField from '../inputs/TextField';
import TextAreaField from '../inputs/TextAreaField';
import SelectField from '../select/SelectField';
import DatePikerField from '../datepicker/DatePikerField';
import TimeFieldCustom from '../timefield/TimeFieldCustom';
import AutocompleteCustom from '../autocomplete/AutocompleteCustom';
import { RadioCustom } from '../radio/RadioCustom';

import { FormField } from '@/shared/types/form-field';
import { FormModalModeType } from '@/shared/types/form-modal-mode-type';
import UploadImageCustom from '../upload/UploadImageCustom';
import { CheckboxCustom } from '../checkbox/CheckboxCustom';
import { getNestedValue, setNestedValue } from '@/shared/utils/object-path';
import NumberFieldCustom from '../inputs/NumberField';

interface CustomFormProps<T extends Record<string, any>> {
    fields: FormField[];

    values: Partial<T> | null;

    onValuesChange: (values: Partial<T>) => void;

    onSubmit?: (values: Partial<T>) => void;

    footer?: ReactNode;

    footerClassName?: string;

    mode?: FormModalModeType;

    onUploadLoadingChange?: (isLoading: boolean) => void;

    renderForm?: boolean;
}

function CustomForm<T extends Record<string, any>>({
    fields,
    values,
    onValuesChange,
    onSubmit,
    footer,
    mode = 'create',
    footerClassName,
    onUploadLoadingChange,
    renderForm = true,
}: CustomFormProps<T>) {
    const isViewMode = mode === 'view';

    const [internalValues, setInternalValues] = useState<Partial<T>>({});

    const formValues = values ?? internalValues;

    const setFormValues = onValuesChange ?? setInternalValues;

    const updateFieldValue = (name: string, value: any) => {
        const newValues = setNestedValue(formValues, name, value);

        setFormValues(newValues);
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        console.log('submit');
        e.preventDefault();

        if (isViewMode) return;

        const form = e.currentTarget;

        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        onSubmit?.(formValues);
    };

    const getColSpanClass = (col?: number) => {
        const colMap: Record<number, string> = {
            1: 'col-span-1',
            2: 'col-span-2',
            3: 'col-span-3',
            4: 'col-span-4',
            5: 'col-span-5',
            6: 'col-span-6',
            12: 'col-span-12',
        };

        return colMap[col || 12] || 'col-span-12';
    };

    const context = {
        mode,
        dataForm: formValues,
    };

    const content = (
        <div className="grid grid-cols-12 gap-5">
            {fields.map((field, i) => {
                const value = getNestedValue(formValues, field.name) ?? field.value ?? '';

                const isRequired =
                    mode === 'view'
                        ? false
                        : typeof field.isRequired === 'function'
                          ? field.isRequired(context)
                          : field.isRequired;

                const isDisabled =
                    mode === 'view'
                        ? true
                        : typeof field.isDisabled === 'function'
                          ? field.isDisabled(context)
                          : field.isDisabled;

                const isReadOnly =
                    mode === 'view'
                        ? true
                        : typeof field.isReadOnly === 'function'
                          ? field.isReadOnly(context)
                          : field.isReadOnly;

                const isHidden =
                    typeof field.hidden === 'function' ? field.hidden(context) : field.hidden;

                if (isHidden) {
                    return null;
                }

                const commonProps = {
                    ...field,
                    value,
                    isDisabled: isDisabled,
                    isReadOnly: isReadOnly,
                    isRequired: isRequired,
                    hidden: isHidden,
                    onChange: (value: any) => updateFieldValue(field.name, value),
                };

                return (
                    <div key={`${field.name}-${i}`} className={`${getColSpanClass(field.col)} w-full`}>
                        {(() => {
                            switch (field.type) {
                                case 'select':
                                    return <SelectField {...commonProps} />;

                                case 'datePicker':
                                    return <DatePikerField {...commonProps} />;

                                case 'timePicker':
                                    return <TimeFieldCustom {...commonProps} />;

                                case 'autocomplete':
                                    return <AutocompleteCustom {...commonProps} />;

                                case 'textarea':
                                    return <TextAreaField {...commonProps} />;

                                case 'checkbox':
                                case 'checkboxGroup':
                                    return <CheckboxCustom {...commonProps} />;

                                case 'radio':
                                    return <RadioCustom {...commonProps} />;

                                case 'image':
                                    return (
                                        <UploadImageCustom
                                            {...commonProps}
                                            onLoadingChange={onUploadLoadingChange}
                                        />
                                    );
                                case 'number':
                                    return <NumberFieldCustom {...commonProps} />;

                                default:
                                    return <AppTextField {...commonProps} />;
                            }
                        })()}
                    </div>
                );
            })}
            {mode !== 'view' && footer && (
                <div
                    className={`flex my-2 gap-3 ${footerClassName ?? 'justify-center col-span-12'}`}
                >
                    {footer}
                </div>
            )}
        </div>
    );

    if (!renderForm) {
        return content;
    }

    return <Form onSubmit={handleSubmit}>{content}</Form>;
}

export default CustomForm;
