'use client';

import { FormField } from '@/shared/types/form-field';
import { FieldError, Input, Label, TextField } from '@heroui/react';

function AppTextField({
    label,
    name,
    type = 'text',
    placeholder,
    isRequired,
    validate,
    isDisabled,
    hidden,
    isReadOnly,
    defaultValue,
    value,
    onChange,
    className,
}: FormField) {
    return (
        <div className="w-full">
            <TextField
                name={name}
                type={type}
                isRequired={isRequired}
                isDisabled={isDisabled}
                hidden={hidden}
                isReadOnly={isReadOnly}
                validate={validate}
                className="w-full"
                value={value ?? defaultValue}
                onChange={onChange}
            >
                <Label className="mb-2 text-sm font-medium text-gray-700">{label}</Label>

                <Input placeholder={placeholder} className={`${className}`} />

                <FieldError />
            </TextField>
        </div>
    );
}

export default AppTextField;
