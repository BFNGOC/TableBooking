'use client';

import { FormField } from '@/types/form';
import { FieldError, Input, Label, TextField } from '@heroui/react';

function AppTextField({
    label,
    name,
    type = 'text',
    placeholder,
    isRequired,
    validate,
}: FormField) {
    return (
        <TextField
            name={name}
            type={type}
            isRequired={isRequired}
            validate={validate}
            className="w-full"
        >
            <Label className="mb-2 text-sm font-medium text-gray-700">{label}</Label>

            <Input placeholder={placeholder} className="h-12" />

            <FieldError />
        </TextField>
    );
}

export default AppTextField;
