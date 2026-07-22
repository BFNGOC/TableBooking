import { parseDate, CalendarDate } from '@internationalized/date';
import { FormField } from '@/shared/types/form-field';
import { FormFieldType } from '../types/form-field-types';

export type FormatMode = 'toForm' | 'toApi';

export function formatFormValues<T extends Record<string, any>>(
    values: Partial<T>,
    fields: FormField[],
    mode: FormatMode
): Partial<T> {
    if (!values) return {};

    const result: Record<string, any> = {
        ...values,
    };

    fields.forEach((field) => {
        const value = result[field.name];

        if (value == null || value === '') return;

        switch (field.type) {
            case FormFieldType.DATE_PICKER:
                if (mode === 'toForm') {
                    if (typeof value === 'string') {
                        result[field.name] = parseDate(value.slice(0, 10));
                    }
                } else {
                    if (value instanceof CalendarDate) {
                        result[field.name] = value.toString();
                    }
                }
                break;

            case FormFieldType.TIME_PICKER:
                if (mode === 'toApi') {
                    if (
                        typeof value === 'object' &&
                        value !== null &&
                        'hour' in value &&
                        'minute' in value
                    ) {
                        result[field.name] = `${String(value.hour).padStart(2, '0')}:${String(
                            value.minute
                        ).padStart(2, '0')}`;
                    }
                }
                break;

            case FormFieldType.SELECT:
                if (field.name === 'isActive' && typeof value === 'string') {
                    result[field.name] = value === 'true';
                }
                break;

            default:
                break;
        }
    });

    return result as Partial<T>;
}
