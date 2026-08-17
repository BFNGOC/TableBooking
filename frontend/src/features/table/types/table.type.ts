export enum TableStatus {
    AVAILABLE = 'AVAILABLE',
    MAINTENANCE = 'MAINTENANCE',
    DISABLED = 'DISABLED',
}

export enum DepositType {
    NONE = 'NONE',
    FIXED = 'FIXED',
    PERCENT = 'PERCENT',
}

export interface ITable {
    _id?: string;
    restaurantId?: string;
    areaId?: string;
    tableNumber: string;
    capacity: number;
    status?: TableStatus;
    description?: string;
    basePrice?: number;
    depositAmount?: number;
    depositType?: DepositType;
    createdAt?: string | Date;
    updatedAt?: string | Date;
}
