'use client';

import { FormField } from '@/shared/types/form-field';
import { Label, ListBox, Select, FieldError } from '@heroui/react';

function SelectField({
    label,
    name,
    placeholder,
    isRequired,
    isDisabled,
    defaultValue,
    options = [],
}: FormField) {
    return (
        <div className="w-full">
            <Select
                className="w-[256px]"
                placeholder={placeholder}
                name={name}
                isRequired={isRequired}
                isDisabled={isDisabled}
                defaultValue={defaultValue}
            >
                <Label className="mb-2 text-sm font-medium text-gray-700">{label}</Label>
                <Select.Trigger>
                    <Select.Value />
                    <Select.Indicator />
                </Select.Trigger>
                <Select.Popover>
                    <ListBox>
                        {options.map((option) => (
                            <ListBox.Item key={option.id} id={option.id} textValue={option.text}>
                                {option.text}
                                <ListBox.ItemIndicator />
                            </ListBox.Item>
                        ))}
                    </ListBox>
                </Select.Popover>

                <FieldError />
            </Select>
        </div>
    );
}

export default SelectField;
