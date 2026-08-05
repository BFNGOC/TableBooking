import { FormField } from '@/shared/types/form-field';
import { FormFieldType } from '@/shared/types/form-field-types';
import {
    BOOKING_STATUS_OPTIONS,
    DEPOSIT_STATUS_OPTIONS,
    PAYMENT_STATUS_OPTIONS,
} from './booking-options';
import BookingTablesField from '@/features/booking/components/BookingTablesField';

export const bookingInfoFormField: FormField[] = [
    {
        name: 'status',
        label: 'Trạng thái đặt bàn',
        type: FormFieldType.SELECT,
        options: BOOKING_STATUS_OPTIONS,
    },
    {
        name: 'bookingDate',
        label: 'Ngày đặt',
        type: FormFieldType.DATE_PICKER,
    },
    {
        name: 'startTime',
        label: 'Giờ bắt đầu',
        type: FormFieldType.TIME_PICKER,
    },
    {
        name: 'endTime',
        label: 'Giờ kết thúc',
        type: FormFieldType.TIME_PICKER,
    },
    {
        name: 'guestCount',
        label: 'Số lượng khách',
        type: FormFieldType.TEXT,
    },
];

export const customerInfoFormField: FormField[] = [
    {
        name: 'userId.avatar',
        label: 'Ảnh đại diện',
        type: FormFieldType.IMAGE,
    },
    {
        name: 'userId.name',
        label: 'Tên khách hàng',
        type: FormFieldType.TEXT,
    },
    {
        name: 'userId.email',
        label: 'Email',
        type: FormFieldType.EMAIL,
    },
    {
        name: 'userId.phone',
        label: 'Số điện thoại',
        type: FormFieldType.TEXT,
    },
    {
        name: 'userId.role',
        label: 'Vai trò',
        type: FormFieldType.TEXT,
    },
];

export const restaurantInfoFormField: FormField[] = [
    {
        name: 'restaurantId.avatar',
        label: 'Ảnh nhà hàng',
        type: FormFieldType.IMAGE,
    },
    {
        name: 'restaurantId.restaurantName',
        label: 'Tên nhà hàng',
        type: FormFieldType.TEXT,
    },
    {
        name: 'restaurantId.address',
        label: 'Địa chỉ',
        type: FormFieldType.TEXT,
    },
    {
        name: 'restaurantId.phone',
        label: 'Số điện thoại',
        type: FormFieldType.TEXT,
    },
    {
        name: 'restaurantId.rating',
        label: 'Đánh giá',
        type: FormFieldType.TEXT,
    },
];

export const tableInfoFormField: FormField[] = [
    {
        name: 'tableIds',
        label: 'Danh sách bàn',
        type: FormFieldType.CUSTOM,
        col: 12,
        render: ({ value }) => {
            return <BookingTablesField value={value} />;
        },
    },
];

export const paymentInfoFormField: FormField[] = [
    {
        name: 'paymentStatus',
        label: 'Trạng thái thanh toán',
        type: FormFieldType.SELECT,
        options: PAYMENT_STATUS_OPTIONS,
    },
    {
        name: 'pricingSnapshot.basePrice',
        label: 'Tiền mặc định',
        type: FormFieldType.TEXT,
    },
    {
        name: 'depositStatus',
        label: 'Trạng thái đặt cọc',
        type: FormFieldType.SELECT,
        options: DEPOSIT_STATUS_OPTIONS,
    },
    {
        name: 'depositAmount',
        label: 'Tiền cọc',
        type: FormFieldType.TEXT,
    },
    {
        name: 'pricingSnapshot.finalPrice',
        label: 'Tổng tiền',
        type: FormFieldType.TEXT,
    },
];
