export enum PricingRuleType {
    HOLIDAY = 'HOLIDAY',
    WEEKEND = 'WEEKEND',
    HAPPY_HOUR = 'HAPPY_HOUR',
    PEAK_HOUR = 'PEAK_HOUR',
    CUSTOM = 'CUSTOM',
}

export enum PricingValueType {
    PERCENT = 'PERCENT',
    FIXED = 'FIXED',
}

export enum PricingApplyType {
    ALL_TABLES = 'ALL_TABLES',
    AREA = 'AREA',
    TABLE = 'TABLE',
}

export enum PricingAdjustmentType {
    INCREASE = 'INCREASE',
    DECREASE = 'DECREASE',
}

export interface IPricingRule {
    _id?: string;
    restaurantId?: string;
    name: string;
    type: PricingRuleType;
    valueType: PricingValueType;
    applyType?: PricingApplyType;
    tableIds?: string[];
    areaIds?: string[];
    value: number;
    priority?: number;
    startDate?: string | Date;
    endDate?: string | Date;
    startTime?: string;
    endTime?: string;
    daysOfWeek?: number[];
    isActive?: boolean;
    adjustmentType: PricingAdjustmentType;
    createdAt?: string | Date;
    updatedAt?: string | Date;
}
