import { FormField, options } from '@/shared/types/form-field';
import { FormFieldType } from '@/shared/types/form-field-types';
import { formRules } from '@/shared/utils/form-rules';

export const basicInformationRestaurant = (cuisineOptions: options[]): FormField[] => [
    {
        name: 'restaurantName',
        label: 'Tên nhà hàng',
        type: FormFieldType.TEXT,
        col: 6,
    },
    {
        name: 'cuisineTypes',
        label: 'Loại hình ẩm thực',
        type: FormFieldType.AUTOCOMPLETE,
        placeholder: 'Chọn loại hình',
        selectionMode: 'multiple',
        isRequired: true,
        options: cuisineOptions,
        col: 6,
    },
    {
        name: 'description',
        label: 'Mô tả chi tiết',
        type: FormFieldType.TEXTAREA,
    },
];

export const contactInformationRestaurant: FormField[] = [
    {
        name: 'phone',
        label: 'Số điện thoạt liên hệ',
        type: FormFieldType.TEXT,
        validate: formRules.phone,
        col: 4,
    },
    {
        name: 'email',
        label: 'Email liên hệ',
        type: FormFieldType.EMAIL,
        validate: formRules.email,
        col: 4,
    },
    {
        name: 'representativeName',
        label: 'Người đại diện',
        type: FormFieldType.TEXT,
        col: 4,
    },
    {
        name: 'address',
        label: 'Địa chỉ chi tiết',
        type: FormFieldType.TEXT,
    },
];

export const businessInformationRestaurant: FormField[] = [
    {
        name: 'priceFrom',
        label: 'Mức giá tối thiểu',
        type: FormFieldType.NUMBER,
        minValue: 1,

        validate: (value: number) => {
            if (!Number.isInteger(Number(value))) {
                return 'Mức giá phải là số nguyên';
            }

            return null;
        },
    },
    {
        name: 'priceTo',
        label: 'Mức giá tối đa',
        type: FormFieldType.NUMBER,
        minValue: 1,

        validate: (value: number) => {
            if (!Number.isInteger(Number(value))) {
                return 'Mức giá phải là số nguyên';
            }

            return null;
        },
    },
    {
        name: 'capacity',
        label: 'Sức chứa tối đa',
        type: FormFieldType.NUMBER,
        minValue: 1,
        validate: (value: number) => {
            if (!Number.isInteger(Number(value))) {
                return 'Sức chứa phải là số nguyên';
            }

            return null;
        },
    },
];

export const operatingHoursRestaurant: FormField[] = [
    {
        name: 'openingTime',
        label: 'Giờ mở cửa',
        type: FormFieldType.TIME_PICKER,
    },

    {
        name: 'closingTime',
        label: 'Giờ đóng cửa',
        type: FormFieldType.TIME_PICKER,

        validate: (value: string) => {
            if (!value) {
                return null;
            }

            return null;
        },
    },
];

export const mediaRestaurant: FormField[] = [
    {
        name: 'avatar',
        label: 'Ảnh đại diện',
        type: FormFieldType.IMAGE,
    },

    {
        name: 'images',
        label: 'Bộ sưu tập ảnh nhà hàng',
        type: FormFieldType.IMAGE,
        multiple: true,
    },
];

export const socialInformationRestaurant: FormField[] = [
    {
        name: 'facebook',
        label: 'Facebook',
        type: FormFieldType.TEXT,
        col: 6,
        validate: (value) => {
            if (!value) return null;

            try {
                new URL(value);
                return null;
            } catch {
                return 'URL Facebook không hợp lệ';
            }
        },
    },
    {
        name: 'instagram',
        label: 'Instagram',
        type: FormFieldType.TEXT,
        col: 6,
        validate: (value) => {
            if (!value) return null;

            try {
                new URL(value);
                return null;
            } catch {
                return 'URL Instagram không hợp lệ';
            }
        },
    },
    {
        name: 'tiktok',
        label: 'TikTok',
        type: FormFieldType.TEXT,
        col: 6,
        validate: (value) => {
            if (!value) return null;

            try {
                new URL(value);
                return null;
            } catch {
                return 'URL TikTok không hợp lệ';
            }
        },
    },
    {
        name: 'website',
        label: 'Website',
        type: FormFieldType.TEXT,
        col: 6,
        validate: (value) => {
            if (!value) return null;

            try {
                new URL(value);
                return null;
            } catch {
                return 'URL Website không hợp lệ';
            }
        },
    },
];
