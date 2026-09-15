'use client';

import { ResolvedFormField } from '@/shared/types/form-field';
import { TextField, TextArea, Label, FieldError } from '@heroui/react';

export default function TextAreaField({
    label,
    name,
    placeholder,
    isRequired,
    isDisabled,
    isReadOnly,
    defaultValue,
    value,
    onChange,
    validate,
    className,
}: ResolvedFormField) {
    return (
        <TextField
            name={name}
            isRequired={isRequired}
            isDisabled={isDisabled}
            isReadOnly={isReadOnly}
            defaultValue={defaultValue}
            value={value ?? defaultValue}
            onChange={onChange}
            validate={validate}
        >
            {label ? (
                <Label className="mb-2 text-sm font-medium text-gray-700">{label}</Label>
            ) : null}

            <TextArea placeholder={placeholder} className={`${className}`} />

            <FieldError />
        </TextField>
    );
}
