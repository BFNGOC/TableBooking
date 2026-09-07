'use client';

import { ResolvedFormField } from '@/shared/types/form-field';
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
}: ResolvedFormField) {
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
                {label ? (
                    <Label className="mb-2 text-sm font-medium text-gray-700">{label}</Label>
                ) : null}

                <Input placeholder={placeholder} className={`${className}`} />

                <FieldError />
            </TextField>
        </div>
    );
}

export default AppTextField;
