import { FormField, options } from '@/shared/types/form-field';
import { FormFieldType } from '@/shared/types/form-field-types';

import { RESTAURANT_STATUS_OPTIONS, RESTAURANT_VERIFY_STATUS_OPTIONS } from './restaurant-options';

export const onboardingFormField: FormField[] = [
    {
        name: 'restaurantCode',
        label: 'Mã nhà hàng',
        type: FormFieldType.TEXT,
    },

    {
        name: 'restaurantName',
        label: 'Tên nhà hàng',
        type: FormFieldType.TEXT,
    },
    {
        name: 'taxCode',
        label: 'Mã số thuế',
        type: FormFieldType.TEXT,
    },
    {
        name: 'representativeName',
        label: 'Chủ sở hữu',
        type: FormFieldType.TEXT,
    },
    {
        name: 'verifyStatus',
        label: 'Trạng thái xác minh',
        type: FormFieldType.SELECT,
        options: RESTAURANT_VERIFY_STATUS_OPTIONS,
    },
    {
        name: 'status',
        label: 'Trạng thái hoạt động',
        type: FormFieldType.SELECT,
        options: RESTAURANT_STATUS_OPTIONS,
    },
    {
        name: 'onboardingRequestedAt',
        label: 'Ngày tạo',
        type: FormFieldType.DATE_PICKER,
    },
    {
        name: 'verifyNote',
        label: 'Ghi chú admin',
        type: FormFieldType.TEXTAREA,
    },
];

export const restaurantProfileFormField = (cuisineOptions: options[]): FormField[] => [
    {
        name: 'avatar',
        label: 'Ảnh đại diện',
        type: FormFieldType.IMAGE,
    },
    {
        name: 'images',
        label: 'Hình ảnh nhà hàng',
        type: FormFieldType.IMAGE,
        multiple: true,
    },
    {
        name: 'description',
        label: 'Mô tả',
        type: FormFieldType.TEXTAREA,
    },
    {
        name: 'phone',
        label: 'Số điện thoại liên hệ',
        type: FormFieldType.TEXT,
    },
    {
        name: 'email',
        label: 'Email liên hệ',
        type: FormFieldType.EMAIL,
    },
    {
        name: 'address',
        label: 'Địa chỉ',
        type: FormFieldType.TEXT,
    },
    {
        name: 'representativeName',
        label: 'Người đại diện',
        type: FormFieldType.TEXT,
    },
    {
        name: 'cuisineTypes',
        label: 'Loại hình ẩm thực',
        type: FormFieldType.AUTOCOMPLETE,
        placeholder: 'Chọn loại hình',
        selectionMode: 'multiple',
        isRequired: true,
        options: cuisineOptions,
    },
    {
        name: 'capacity',
        label: 'Sức chứa',
        type: FormFieldType.TEXT,
    },
    {
        name: 'priceFrom',
        label: 'Giá từ',
        type: FormFieldType.TEXT,
    },
    {
        name: 'priceTo',
        label: 'Giá đến',
        type: FormFieldType.TEXT,
    },
    {
        name: 'openingTime',
        label: 'Giờ mở cửa',
        type: FormFieldType.TIME_PICKER,
    },
    {
        name: 'closingTime',
        label: 'Giờ đóng cửa',
        type: FormFieldType.TIME_PICKER,
    },
];

export const userProfileFormField: FormField[] = [
    {
        name: 'user.avatar',
        label: 'Ảnh đại diện',
        type: FormFieldType.IMAGE,
    },
    {
        name: 'user.name',
        label: 'Họ và tên',
        type: FormFieldType.TEXT,
        placeholder: '0123456789',
    },
    {
        name: 'user.phone',
        label: 'Số điện thoại',
        type: FormFieldType.TEXT,
        placeholder: '0123456789',
    },
    {
        name: 'user.email',
        label: 'email',
        type: FormFieldType.EMAIL,
        placeholder: 'abc@gmail.com',
    },
];
