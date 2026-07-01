'use client';

import { FormField } from '@/shared/types/form-field';
import { Label, FieldError, TimeField } from '@heroui/react';

export default function TimeFieldCustom({
    label,
    name,
    isRequired,
    isDisabled,
    isReadOnly,
    defaultTime,
    className,
}: FormField) {
    return (
        <TimeField
            className="w-[256px]"
            name={name}
            isRequired={isRequired}
            isDisabled={isDisabled}
            isReadOnly={isReadOnly}
            defaultValue={defaultTime}
        >
            <Label className="mb-2 text-sm font-medium text-gray-700">{label}</Label>
            <TimeField.Group className={className}>
                <TimeField.Input>
                    {(segment) => <TimeField.Segment segment={segment} />}
                </TimeField.Input>
            </TimeField.Group>

            <FieldError />
        </TimeField>
    );
}
