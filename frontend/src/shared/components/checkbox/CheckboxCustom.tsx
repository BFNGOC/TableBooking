import { ResolvedFormField } from '@/shared/types/form-field';
import { Checkbox, CheckboxGroup, Description, Label } from '@heroui/react';

export function CheckboxCustom({
    label,
    description,
    name,
    isRequired,
    isDisabled,
    hidden,
    value,
    onChange,
    options = [],
    className,
}: ResolvedFormField) {
    // Normalize incoming value to an array of strings for CheckboxGroup
    const selectedValues: string[] = Array.isArray(value)
        ? value.map((v) => String(v))
        : value == null || value === ''
          ? []
          : [String(value)];

    const handleChange = (next: any) => {
        if (!onChange) return;

        // next might be an array, Set, string or iterable depending on the implementation
        if (Array.isArray(next)) return onChange(next.map((v) => String(v)));

        if (next instanceof Set) return onChange(Array.from(next).map((v) => String(v)));

        // If it's an iterable (like Keys), try to convert
        try {
            if (typeof next === 'object' && next != null && Symbol.iterator in next) {
                return onChange(Array.from(next as Iterable<any>).map((v) => String(v)));
            }
        } catch {
            /* ignore */
        }

        // fallback: single value
        return onChange([String(next)]);
    };

    if (hidden) return null;

    return (
        <div className={`w-full ${className ?? ''}`.trim()}>
            <CheckboxGroup
                className="min-w-[320px]"
                name={name}
                value={selectedValues}
                onChange={handleChange}
                isRequired={isRequired}
                isDisabled={isDisabled}
                hidden={hidden}
            >
                {label ? <Label>{label}</Label> : null}
                {description ? <Description>{description}</Description> : null}

                {options.map((option) => (
                    <Checkbox key={option.id} value={String(option.id)}>
                        <Checkbox.Content>
                            <Checkbox.Control>
                                <Checkbox.Indicator />
                            </Checkbox.Control>
                            {option.text}
                        </Checkbox.Content>
                        {option.description ? (
                            <Description>{option.description}</Description>
                        ) : null}
                    </Checkbox>
                ))}
            </CheckboxGroup>
        </div>
    );
}
