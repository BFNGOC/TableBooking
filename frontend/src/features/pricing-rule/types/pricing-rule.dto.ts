import {
    PricingAdjustmentType,
    PricingApplyType,
    PricingRuleType,
    PricingValueType,
} from './pricing-rule.type';

export interface PreviewBookingPricingPayload {
    tableIds: string[];
    bookingDate: string;
    startTime: string;
}

export interface CreatePricingRulePayload {
    name: string;
    type: PricingRuleType;
    valueType: PricingValueType;
    adjustmentType: PricingAdjustmentType;
    value: number;
    applyType?: PricingApplyType;
    tableIds?: string[];
    areaIds?: string[];
    priority?: number;
    startDate?: string;
    endDate?: string;
    startTime?: string;
    endTime?: string;
    daysOfWeek?: number[];
    isActive?: boolean;
}

export type UpdatePricingRulePayload = Partial<CreatePricingRulePayload>;

export interface FindPricingRulesParams {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    keyword?: string;
    type?: PricingRuleType;
    applyType?: PricingApplyType;
    isActive?: boolean;
}

