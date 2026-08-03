import { FormField } from '@/shared/types/form-field';
import { FormFieldType } from '@/shared/types/form-field-types';

export const bookingFormFields: FormField[] = [
    {
        name: 'contactName',
        label: 'Họ và tên',
        type: FormFieldType.TEXT,
        placeholder: 'Ví dụ: Nguyễn Văn A',
        isRequired: true,
    },
    {
        name: 'contactPhone',
        label: 'Số điện thoại',
        type: FormFieldType.TEXT,
        placeholder: '090 123 4567',
        isRequired: true,
    },
    {
        name: 'restaurantNote',
        label: 'Yêu cầu đặc biệt',
        type: FormFieldType.TEXTAREA,
        placeholder: 'Ví dụ: Kỷ niệm ngày cưới, bàn gần cửa sổ...',
    },
    {
        name: 'payDepositNow',
        label: 'Thanh toán tiền cọc ngay',
        type: FormFieldType.RADIO,
        isRequired: true,
        options: [
            {
                id: true,
                text: 'Tôi đồng ý thanh toán tiền cọc ngay',
            },
            {
                id: false,
                text: 'Tôi muốn thanh toán tiền cọc sau',
            },
        ],
    },
];
