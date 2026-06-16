'use client';

import { ReactNode } from 'react';
import { Form } from '@heroui/react';

import AppTextField from '../inputs/TextField';
import { FormField } from '@/shared/types/form';

interface CustomFormProps<T extends Record<string, any>> {
    fields: FormField[];
    onSubmit: (data: T) => void | Promise<void>;
    footer?: ReactNode;
}

function CustomForm<T extends Record<string, any>>({
    fields,
    onSubmit,
    footer,
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
                const renderField = () => {
                    switch (field.type) {
                        case 'select':
                        // return <AppSelectField key={field.name} {...field} />;

                        case 'date':
                        // return <AppDateField key={field.name} {...field} />;

                        case 'time':
                        // return <AppTimeField key={field.name} {...field} />;

                        case 'textarea':
                        // return <AppTextareaField key={field.name} {...field} />;

                        default:
                            return <AppTextField key={field.name} {...field} />;
                    }
                };

                return (
                    <div key={field.name} className={`${getColSpanClass(field.col)}`}>
                        {renderField()}
                    </div>
                );
            })}

            {footer && <div className="col-span-12 mt-2">{footer}</div>}
        </Form>
    );
}

export default CustomForm;
