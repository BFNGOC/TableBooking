import { TableStatus } from '../types/table.type';

export const TABLE_STATUS_OPTIONS: {
    id: TableStatus;
    text: string;
}[] = [
    { id: TableStatus.AVAILABLE, text: 'Còn trống' },
    { id: TableStatus.MAINTENANCE, text: 'Đang bảo trì' },
    { id: TableStatus.DISABLED, text: 'Không khả dụng' },
];
