import { FormField } from '@/shared/types/form-field';
import { FormFieldType } from '@/shared/types/form-field-types';

/**
 * Base fields cho review form — không chứa JSX.
 * render() của field 'rating' được inject tại ReviewFormModal.tsx
 */
export const REVIEW_FORM_FIELDS: FormField[] = [
    {
        name: 'rating',
        label: 'Đánh giá',
        type: FormFieldType.CUSTOM,
        col: 12,
        isRequired: true,
        // render sẽ được override ở ReviewFormModal
    },
    {
        name: 'comment',
        label: 'Nhận xét',
        type: FormFieldType.TEXTAREA,
        col: 12,
        placeholder: 'Chia sẻ trải nghiệm của bạn về nhà hàng...',
        isRequired: false,
    },
    {
        name: 'images',
        label: 'Hình ảnh',
        type: FormFieldType.IMAGE,
        col: 12,
        multiple: true,
        maxFiles: 5,
        isRequired: false,
    },
];
