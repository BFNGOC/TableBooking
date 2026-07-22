'use client';

import { useState, useEffect } from 'react';
import { FormField } from '@/shared/types/form-field';
import { Label, FieldError, TimeField } from '@heroui/react';

export default function TimeFieldCustom({
    label,
    name,
    isRequired,
    isDisabled,
    isReadOnly,
    defaultTime,
    value,
    onChange,
    className,
}: FormField) {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return (
            <div className="w-[256px]">
                {label && <div className="mb-2 text-sm font-medium text-gray-700">{label}</div>}
                <div className={`h-10 bg-gray-100 animate-pulse rounded-lg ${className}`} />
            </div>
        );
    }

    return (
        <TimeField
            className="w-[256px]"
            name={name}
            isRequired={isRequired}
            isDisabled={isDisabled}
            isReadOnly={isReadOnly}
            defaultValue={defaultTime}
            value={value ?? defaultTime}
            onChange={onChange}
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
