import { FormField } from '@/shared/types/form-field';
import { FormFieldType } from '@/shared/types/form-field-types';
import { TableStatus, DepositType } from '../types/table.type';

export const TABLE_DETAIL_FIELDS: FormField[] = [
    {
        name: 'tableNumber',
        label: 'Số hiệu bàn',
        type: FormFieldType.TEXT,
        isRequired: true,
        col: 12,
        placeholder: 'VD: A01, B02...',
    },
    {
        name: 'capacity',
        label: 'Sức chứa (người)',
        type: FormFieldType.NUMBER,
        isRequired: true,
        col: 6,
        minValue: 1,
    },
    {
        name: 'status',
        label: 'Trạng thái',
        type: FormFieldType.SELECT,
        col: 6,
        options: [
            { id: TableStatus.AVAILABLE, text: 'Sẵn sàng' },
            { id: TableStatus.MAINTENANCE, text: 'Bảo trì' },
            { id: TableStatus.DISABLED, text: 'Ngưng hoạt động' },
        ],
    },
    {
        name: 'basePrice',
        label: 'Giá cơ bản (VND)',
        type: FormFieldType.NUMBER,
        col: 6,
        minValue: 0,
    },
    {
        name: 'depositType',
        label: 'Loại đặt cọc',
        type: FormFieldType.SELECT,
        col: 6,
        options: [
            { id: DepositType.NONE, text: 'Không cọc' },
            { id: DepositType.FIXED, text: 'Cố định (VND)' },
            { id: DepositType.PERCENT, text: 'Phần trăm (%)' },
        ],
    },
    {
        name: 'depositAmount',
        label: 'Số tiền đặt cọc (VND)',
        type: FormFieldType.NUMBER,
        col: 12,
        minValue: 0,
        placeholder: 'Nhập số tiền cọc...',
        hidden: ({ dataForm }) =>
            !dataForm.depositType || dataForm.depositType !== DepositType.FIXED,
    },
    {
        name: 'depositAmount',
        label: 'Phần trăm đặt cọc (%)',
        type: FormFieldType.NUMBER,
        col: 12,
        minValue: 0,
        maxValue: 100,
        placeholder: 'Nhập % (0 - 100)',
        validate: (value) => {
            const num = Number(value);
            if (num < 0 || num > 100) return 'Phần trăm phải từ 0 đến 100';
            return null;
        },
        hidden: ({ dataForm }) =>
            !dataForm.depositType || dataForm.depositType !== DepositType.PERCENT,
    },
    {
        name: 'description',
        label: 'Ghi chú',
        type: FormFieldType.TEXTAREA,
        col: 12,
        placeholder: 'Ghi chú thêm về bàn...',
    },
];
