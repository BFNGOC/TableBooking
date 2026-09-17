import { FormSection } from '@/shared/components/modals/ModalFormTabs';
import { formatFormValues } from './format-form-values';

export function formatSectionFormValues<T extends Record<string, any>>(
    values: Partial<T> | null,
    sections: FormSection[],
    mode: 'toForm' | 'toApi'
) {
    let result = { ...values };

    sections.forEach((section) => {
        result = formatFormValues(result, section.fields, mode);
    });

    return result;
}
