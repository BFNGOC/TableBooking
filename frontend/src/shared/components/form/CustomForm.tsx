'use client';

import { ReactNode } from 'react';
import { Form } from '@heroui/react';

import AppTextField from '../inputs/TextField';
import { FormField } from '@/shared/types/form-field';

interface CustomFormProps<T extends Record<string, any>> {
    fields: FormField[];
    onSubmit: (data: T) => void | Promise<void>;
    footer?: ReactNode;
    defaultValues?: Record<string, any>;
}

function CustomForm<T extends Record<string, any>>({
    fields,
    onSubmit,
    footer,
    defaultValues,
}: CustomFormProps<T>) {
    const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);

        const data = {} as T;

        formData.forEach((value, key) => {
            (data as Record<string, any>)[key] = value.toString();
        });

        onSubmit(data);
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
                    defaultValue: defaultValues?.[field.name] || field.defaultValue,
                };

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
                        // return <AppSelectField key={fieldWithDefaults.name} {...fieldWithDefaults} />;

                        case 'date':
                        // return <AppDateField key={fieldWithDefaults.name} {...fieldWithDefaults} />;

                        case 'time':
                        // return <AppTimeField key={fieldWithDefaults.name} {...fieldWithDefaults} />;

                        case 'textarea':
                        // return <AppTextareaField key={fieldWithDefaults.name} {...fieldWithDefaults} />;

                        default:
                            return (
                                <AppTextField key={fieldWithDefaults.name} {...fieldWithDefaults} />
                            );
                    }
                };

                return (
                    <div
                        key={fieldWithDefaults.name}
                        className={`${getColSpanClass(fieldWithDefaults.col)}`}
                    >
                        {renderField()}
                    </div>
                );
            })}

            {footer && <div className="col-span-12 mt-2">{footer}</div>}
        </Form>
    );
}

export default CustomForm;
