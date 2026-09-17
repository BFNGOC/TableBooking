import { FormField } from '@/shared/types/form-field';
import { FormFieldType } from '@/shared/types/form-field-types';
import {
    BOOKING_STATUS_OPTIONS,
    DEPOSIT_STATUS_OPTIONS,
    PAYMENT_STATUS_OPTIONS,
} from './booking-options';

export const bookingRestaurantFilterFormFields: FormField[] = [
    {
        name: 'keySearch',
        label: 'Tìm kiếm',
        type: FormFieldType.TEXT,
        placeholder: 'Tên khách / SĐT',
        col: 4,
    },
    {
        name: 'status',
        label: 'Trạng thái đặt bàn',
        type: FormFieldType.SELECT,
        options: BOOKING_STATUS_OPTIONS,
        col: 4,
    },
    {
        name: 'paymentStatus',
        label: 'Trạng thái thanh toán',
        type: FormFieldType.SELECT,
        options: PAYMENT_STATUS_OPTIONS,
        col: 4,
    },
    {
        name: 'depositStatus',
        label: 'Trạng thái tiền cọc',
        type: FormFieldType.SELECT,
        options: DEPOSIT_STATUS_OPTIONS,
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
