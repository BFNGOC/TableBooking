'use client';

import { Button, Form } from '@heroui/react';

import AppTextField from './AppTextField';

import { FormField } from '@/types/form';

interface DynamicFormProps {
    fields: FormField[];
    submitText: string;
    onSubmit: (data: Record<string, string>) => void;
}

function DynamicForm({ fields, submitText, onSubmit }: DynamicFormProps) {
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);

        const data: Record<string, string> = {};

        formData.forEach((value, key) => {
            data[key] = value.toString();
        });

        onSubmit(data);
    };

    return (
        <Form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {fields.map((field) => (
                <AppTextField
                    key={field.name}
                    label={field.label}
                    name={field.name}
                    type={field.type}
                    placeholder={field.placeholder}
                    isRequired={field.isRequired}
                    validate={field.validate}
                />
            ))}

            <Button
                type="submit"
                className="mt-2 h-12 w-full bg-[#6f4e37] text-base font-semibold text-white"
            >
                {submitText}
            </Button>
        </Form>
    );
}

export default DynamicForm;
