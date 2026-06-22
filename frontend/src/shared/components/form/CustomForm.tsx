'use client';

import { ReactNode } from 'react';
import { Form } from '@heroui/react';

import AppTextField from '../inputs/TextField';
import { FormField } from '@/shared/types/form-field';
import { FormModalModeType } from '@/shared/types/form-modal-mode-type';

interface CustomFormProps<T extends Record<string, any>> {
    fields: FormField[];
    onSubmit?: (data: T) => void | Promise<void>;
    footer?: ReactNode;
    defaultValues?: Record<string, any>;
    mode?: FormModalModeType;
}

function CustomForm<T extends Record<string, any>>({
    fields,
    onSubmit,
    footer,
    defaultValues,
    mode = 'create',
}: CustomFormProps<T>) {
    const isViewMode = mode === 'view';

    const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (isViewMode) return;

        const formData = new FormData(e.currentTarget);

        const data = {} as T;

        formData.forEach((value, key) => {
            (data as Record<string, any>)[key] = value.toString();
        });

        if (onSubmit) {
            onSubmit(data);
        }
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
        <Form onSubmit={handleFormSubmit} className="grid grid-cols-12 gap-5">
            {fields.map((field) => {
                const fieldWithDefaults = {
                    ...field,
                    defaultValue: defaultValues?.[field.name] ?? field.defaultValue,
                };

                const isDisabled = isViewMode ? true : field.isDisabled;

                const isReadOnly = isViewMode ? true : field.isReadOnly;

                if (fieldWithDefaults.hidden) {
                    return (
                        <input
                            key={fieldWithDefaults.name}
                            type="hidden"
                            name={fieldWithDefaults.name}
                            value={fieldWithDefaults.defaultValue || ''}
                        />
                    );
                }

                const renderField = () => {
                    switch (fieldWithDefaults.type) {
                        case 'select':
                        // return <AppSelectField {...fieldWithDefaults} />;

                        case 'date':
                        // return <AppDateField {...fieldWithDefaults} />;

                        case 'time':
                        // return <AppTimeField {...fieldWithDefaults} />;

                        case 'textarea':
                        // return <AppTextareaField {...fieldWithDefaults} />;

                        default:
                            return (
                                <AppTextField
                                    {...fieldWithDefaults}
                                    isDisabled={isDisabled}
                                    isReadOnly={isReadOnly}
                                />
                            );
                    }
                };

                return (
                    <div
                        key={fieldWithDefaults.name}
                        className={getColSpanClass(fieldWithDefaults.col)}
                    >
                        {renderField()}
                    </div>
                );
            })}

            {mode !== 'view' && footer && (
                <div className="col-span-12 mt-2 flex justify-end gap-3">{footer}</div>
            )}
        </Form>
    );
}

export default CustomForm;
