'use client';

import { NumberFormField } from '@/shared/types/form-field';
import { NumberField as HeroNumberField, Label, FieldError } from '@heroui/react';

export default function NumberFieldCustom({
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
    minValue,
}: NumberFormField) {
    return (
        <HeroNumberField
            name={name}
            isRequired={isRequired}
            isDisabled={isDisabled}
            isReadOnly={isReadOnly}
            minValue={minValue}
            defaultValue={defaultValue}
            value={value ?? defaultValue}
            onChange={onChange}
            validate={validate}
            className={className}
        >
            <Label className="mb-2 text-sm font-medium text-gray-700">{label}</Label>

            <HeroNumberField.Group>
                <HeroNumberField.DecrementButton />
                {/* placeholder được truyền vào thẻ Input thực tế */}
                <HeroNumberField.Input placeholder={placeholder} className="w-[120px]" />
                <HeroNumberField.IncrementButton />
            </HeroNumberField.Group>

            <FieldError />
        </HeroNumberField>
    );
}
