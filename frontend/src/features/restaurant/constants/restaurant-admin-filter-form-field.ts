import { FormField } from '@/shared/types/form-field';
import { FormFieldType } from '@/shared/types/form-field-types';
import { RestaurantVerifyStatus } from '../types/restaurant.type';
import { RESTAURANT_STATUS_OPTIONS, RESTAURANT_VERIFY_STATUS_OPTIONS } from './restaurant-options';

export const restaurantAdminFilterFormFields: FormField[] = [
    {
        name: 'restaurantCode',
        label: 'Mã nhà hàng',
        type: FormFieldType.TEXT,
        placeholder: 'Nhập mã nhà hàng',
        col: 4,
    },
    {
        name: 'taxCode',
        label: 'Mã số thuế',
        type: FormFieldType.TEXT,
        placeholder: 'Nhập mã số thuế',
        col: 4,
    },
    {
        name: 'verifyStatus',
        label: 'Trạng thái xác minh',
        options: RESTAURANT_VERIFY_STATUS_OPTIONS,
        type: FormFieldType.SELECT,
        value: RestaurantVerifyStatus.APPROVED,
        isDisabled: true,
        col: 4,
    },
    {
        name: 'status',
        label: 'Trạng thái hoạt động',
        type: FormFieldType.SELECT,
        options: RESTAURANT_STATUS_OPTIONS,
        col: 4,
    },
    {
        name: 'fromDate',
        label: 'Từ ngày',
        type: FormFieldType.DATE,

        col: 4,
    },
    {
        name: 'toDate',
        label: 'Đến ngày',
        type: FormFieldType.DATE,
        col: 4,
    },
];
