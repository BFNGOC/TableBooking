import { Label, Radio, RadioGroup, Description } from '@heroui/react';
import { FormField } from '@/shared/types/form-field';

export function RadioCustom({
    label,
    description,
    name,
    value,
    onChange,
    options = [],
    isDisabled,
    hidden,
    className,
}: FormField) {
    if (hidden) return null;

    const selectedValue = value == null || value === '' ? undefined : String(value);

    const handleChange = (next: any) => {
        if (!onChange) return;
        onChange(String(next));
    };

    return (
        <div className={`w-full ${className ?? ''}`.trim()}>
            <RadioGroup
                name={name}
                value={selectedValue}
                onChange={handleChange}
                isDisabled={isDisabled}
            >
                {label ? (
                    <Label className="mb-2 text-sm font-medium text-gray-700">{label}</Label>
                ) : null}
                {description ? (
                    <Description className="mb-2 text-sm text-gray-500">{description}</Description>
                ) : null}

                {options.map((option) => (
                    <Radio key={option.id} value={String(option.id)}>
                        <Radio.Content>
                            <Radio.Control>
                                <Radio.Indicator />
                            </Radio.Control>
                            {option.text}
                        </Radio.Content>
                    </Radio>
                ))}
            </RadioGroup>
        </div>
    );
}
