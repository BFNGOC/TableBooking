'use client';

import { useEffect, useMemo } from 'react';
import ModalFormTabs, { FormSection } from '@/shared/components/modals/ModalFormTabs';
import { FormModalModeType } from '@/shared/types/form-modal-mode-type';
import { IReview } from '../types/review.type';
import { REVIEW_FORM_FIELDS } from '../constants/review-form-fields';
import StarRatingField from './StarRatingField';

interface ReviewFormModalProps {
    isOpen: boolean;
    mode?: FormModalModeType;
    values: Partial<IReview> | null;
    onValuesChange: (values: Partial<IReview>) => void;
    onSubmit: (values: Partial<IReview>) => void;
    onClose: () => void;
    isPending?: boolean;
    /** Truyền vào khi tạo mới, sẽ được inject vào payload */
    bookingId?: string;
}

export default function ReviewFormModal({
    isOpen,
    mode = 'create',
    values,
    onValuesChange,
    onSubmit,
    onClose,
    isPending,
    bookingId,
}: ReviewFormModalProps) {
    // Inject bookingId khi mở modal tạo mới
    useEffect(() => {
        if (isOpen && mode === 'create' && bookingId) {
            onValuesChange({ ...(values ?? {}), bookingId });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen, bookingId]);

    const sections: FormSection<IReview>[] = useMemo(
        () => [
            {
                key: 'review',
                title: 'Đánh giá',
                fields: REVIEW_FORM_FIELDS.map((field) => {
                    if (field.name === 'rating') {
                        return {
                            ...field,
                            render: ({ value, onChange }: { value: any; onChange: (v: any) => void }) => (
                                <StarRatingField value={value ?? 0} onChange={onChange} />
                            ),
                        };
                    }
                    return field;
                }),
            },
        ],
        [],
    );

    const handleSubmit = (formValues: Partial<IReview>) => {
        const payload: Partial<IReview> = {
            ...formValues,
            // Đảm bảo bookingId được giữ lại khi submit
            ...(mode === 'create' && bookingId ? { bookingId } : {}),
        };
        onSubmit(payload);
    };

    return (
        <ModalFormTabs<IReview>
            isOpen={isOpen}
            mode={mode}
            title={({ mode }) =>
                mode === 'create' ? 'Viết đánh giá' : 'Chỉnh sửa đánh giá'
            }
            sections={sections}
            values={values}
            onValuesChange={onValuesChange}
            onSubmit={handleSubmit}
            onClose={onClose}
            isPending={isPending}
        />
    );
}
