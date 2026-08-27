import { FormField } from '@/shared/types/form-field';
import { FormFieldType } from '@/shared/types/form-field-types';
import { FormSection } from '@/shared/components/modals/ModalFormTabs';

export const AREA_SECTIONS: FormSection[] = [
    {
        key: 'info',
        title: 'Thông tin khu vực',
        fields: [
            {
                name: 'name',
                label: 'Tên khu vực',
                type: FormFieldType.TEXT,
                isRequired: true,
                col: 12,
                placeholder: 'VD: Tầng trệt, Sân thượng, Phòng VIP...',
            },
            {
                name: 'description',
                label: 'Mô tả',
                type: FormFieldType.TEXTAREA,
                col: 12,
                placeholder: 'Mô tả thêm về khu vực...',
            },
        ] as FormField[],
    },
];
