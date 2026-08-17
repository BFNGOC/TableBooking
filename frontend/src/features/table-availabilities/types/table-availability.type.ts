export interface ITimeSlot {
    startTime: string;
    endTime: string;
}

export interface IWeeklySlot {
    dayOfWeek: number;
    isActive: boolean;
    slots: ITimeSlot[];
}

export interface IExceptionSlot {
    date: string | Date;
    reason?: string;
    isClosed: boolean;
    slots: ITimeSlot[];
}

export interface ITableAvailability {
    _id?: string;
    tableIds: string[];
    restaurantId?: string;
    weeklySlots?: IWeeklySlot[];
    exceptions?: IExceptionSlot[];
    createdAt?: string | Date;
    updatedAt?: string | Date;
}
