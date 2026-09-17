'use client';

import ModalFormTabs, { FormSection } from '@/shared/components/modals/ModalFormTabs';

import { formatSectionFormValues } from '@/shared/utils/format-section-form-values';
import { FormModalModeType } from '@/shared/types/form-modal-mode-type';

interface RestaurantDetailModalProps<T extends Record<string, any>> {
    open: boolean;

    mode: FormModalModeType;

    data?: T | null;

    loading?: boolean;

    sections: FormSection[];

    title: string;

    onClose: () => void;

    onSubmit?: () => void;

    onValuesChange?: (values: Partial<T>) => void;
}

function RestaurantDetailModal<T extends Record<string, any>>({
    open,
    mode,
    data,
    loading,
    sections,
    title,
    onClose,
    onSubmit,
    onValuesChange,
}: RestaurantDetailModalProps<T>) {
    const formValues = formatSectionFormValues(data ?? null, sections, 'toForm') as Partial<T>;

    return (
        <ModalFormTabs<T>
            isOpen={open}
            title={title}
            mode={mode}
            values={formValues ?? {}}
            onValuesChange={onValuesChange ?? (() => {})}
            sections={sections}
            onClose={onClose}
            onSubmit={onSubmit ?? (() => {})}
            isPending={loading}
        />
    );
}

export default RestaurantDetailModal;
