import { FormSection } from '@/shared/components/modals/ModalFormTabs';
import {
    bookingInfoFormField,
    customerInfoFormField,
    paymentInfoFormField,
    restaurantInfoFormField,
    tableInfoFormField,
} from './booking-restaurant-section-form-field';

export const bookingSections = (): FormSection[] => [
    {
        key: 'booking',
        title: 'Thông tin đặt bàn',
        fields: bookingInfoFormField,
    },
    {
        key: 'customer',
        title: 'Thông tin khách hàng',
        fields: customerInfoFormField,
    },
    // {
    //     key: 'restaurant',
    //     title: 'Thông tin nhà hàng',
    //     fields: restaurantInfoFormField,
    // },
    {
        key: 'tables',
        title: 'Thông tin bàn',
        fields: tableInfoFormField,
    },
    {
        key: 'payment',
        title: 'Thông tin thanh toán',
        fields: paymentInfoFormField,
    },
];
