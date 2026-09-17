export interface ITimeSlot {
    startTime: string;
    endTime: string;
}

export interface IWeeklySlot {
    dayOfWeek: number; // 0=CN, 1=T2, 2=T3, 3=T4, 4=T5, 5=T6, 6=T7
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

// ─── Payload types (match BE DTOs) ────────────────────────────────────────────

export interface ITimeSlotPayload {
    startTime: string;
    endTime: string;
}

export interface IWeeklySlotPayload {
    dayOfWeek: number;
    isActive?: boolean;
    slots: ITimeSlotPayload[];
}

export interface IExceptionSlotPayload {
    date: string;
    reason?: string;
    isClosed?: boolean;
    slots?: ITimeSlotPayload[];
}

export interface CreateTableAvailabilityPayload {
    tableIds: string[];
    weeklySlots: IWeeklySlotPayload[];
    exceptions?: IExceptionSlotPayload[];
}

export type UpdateTableAvailabilityPayload = Partial<CreateTableAvailabilityPayload>;

export interface FindTableAvailabilityParams {
    restaurantId?: string;
    date?: string;
    tableId?: string;
}
