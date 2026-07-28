export interface IAreaDetail {
    _id: string;
    restaurantId: string;
    name: string;
    description?: string;
    __v?: number;
    createdAt: string;
    updatedAt: string;
}

export interface ITableDetail {
    _id: string;
    restaurantId: string;
    areaId: string | IAreaDetail;
    tableNumber: string;
    capacity: number;
    status: 'AVAILABLE' | 'OCCUPIED' | 'RESERVED' | string;
    description?: string;
    basePrice: number;
    depositAmount: number;
    depositType: 'FIXED' | 'PERCENT' | 'NONE' | string;
    depositStatus: 'NOT_REQUIRED' | 'REQUIRED' | string;
    __v?: number;
    createdAt: string;
    updatedAt: string;
}

export interface IGroupedArea {
    area: IAreaDetail;
    tables: ITableDetail[];
}

export interface GetAvailableTablesResponse {
    restaurantId: string;
    date: string;
    startTime: string;
    endTime: string;
    dayOfWeek: number;
    guestCount: number;
    areas: IGroupedArea[];
}
