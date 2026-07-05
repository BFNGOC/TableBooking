'use client';

import { ReactNode } from 'react';
import { Form } from '@heroui/react';
import AppTextField from '../inputs/TextField';
import TextAreaField from '../inputs/TextAreaField';
import SelectField from '../select/SelectField';
import DatePikerField from '../datepicker/DatePikerField';
import TimeFieldCustom from '../timefield/TimeFieldCustom';

import { FormField } from '@/shared/types/form-field';
import { FormModalModeType } from '@/shared/types/form-modal-mode-type';

interface CustomFormProps<T extends Record<string, any>> {
    fields: FormField[];

    values: Partial<T>;

    onValuesChange: (values: Partial<T>) => void;

    onSubmit?: (values: Partial<T>) => void;

    footer?: ReactNode;

    mode?: FormModalModeType;
}

function CustomForm<T extends Record<string, any>>({
    fields,
    values,
    onValuesChange,
    onSubmit,
    footer,
    mode = 'create',
}: CustomFormProps<T>) {
    const isViewMode = mode === 'view';

    const updateFieldValue = (name: string, value: any) => {
        onValuesChange({
            ...values,
            [name]: value,
        });
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (isViewMode) return;

        onSubmit?.(values);
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

    return (
        <Form onSubmit={handleSubmit} className="grid grid-cols-12 gap-5">
            {fields.map((field) => {
                const value = values[field.name] ?? '';
                const isDisabled = mode === 'view' ? true : field.isDisabled;

                const isReadOnly = mode === 'view' ? true : field.isReadOnly;

                const commonProps = {
                    ...field,
                    value,
                    onChange: (value: any) => updateFieldValue(field.name, value),
                };

                return (
                    <div key={field.name} className={`${getColSpanClass(field.col)} w-full`}>
                        {(() => {
                            switch (field.type) {
                                case 'select':
                                    return <SelectField {...commonProps} />;

                                case 'datePicker':
                                    return <DatePikerField {...commonProps} />;

                                case 'timePicker':
                                    return <TimeFieldCustom {...commonProps} />;

                                case 'textarea':
                                    return <TextAreaField {...commonProps} />;

                                default:
                                    return (
                                        <AppTextField
                                            {...commonProps}
                                            isDisabled={isDisabled}
                                            isReadOnly={isReadOnly}
                                        />
                                    );
                            }
                        })()}
                    </div>
                );
            })}

            {mode !== 'view' && footer && (
                <div className="col-span-12 flex justify-center my-2">{footer}</div>
            )}
        </Form>
    );
}

export default CustomForm;
