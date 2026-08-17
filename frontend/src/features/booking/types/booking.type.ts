import { DepositType } from '@/features/table/types/table.type';
import { PricingRuleType, PricingValueType } from '@/features/pricing-rule/types/pricing-rule.type';

export enum BookingStatus {
    PENDING = 'PENDING',
    REJECTED = 'REJECTED',
    CONFIRMED = 'CONFIRMED',
    CANCELLED = 'CANCELLED',
    CHECKED_IN = 'CHECKED_IN',
    COMPLETED = 'COMPLETED',
    NO_SHOW = 'NO_SHOW',
}

export enum DepositStatus {
    NOT_REQUIRED = 'NOT_REQUIRED',
    PENDING = 'PENDING',
    PAID = 'PAID',
    REFUNDED = 'REFUNDED',
    FORFEITED = 'FORFEITED',
}

export enum PaymentStatus {
    UNPAID = 'UNPAID',
    PAID = 'PAID',
    PARTIAL = 'PARTIAL',
    REFUNDED = 'REFUNDED',
}

export interface IPriceAdjustment {
    ruleId?: string;
    ruleName?: string;
    type?: PricingRuleType;
    value?: number;
    valueType?: PricingValueType;
    amount?: number;
}

export interface IPricingSnapshot {
    basePrice?: number;
    finalPrice?: number;
    adjustments?: IPriceAdjustment[];
    calculatedAt?: string | Date;
}

export interface ITableDepositSnapshot {
    tableId: string;
    depositType: DepositType;
    depositRate?: number;
    depositAmount: number;
}

export interface IBooking {
    _id?: string;
    userId?: string;
    restaurantId?: string;
    guestCount: number;
    restaurantNote?: string;
    status?: BookingStatus;
    rejectionReason?: string;
    contactName?: string;
    contactPhone?: string;
    arrivedAt?: string | Date;
    cancelReason?: string;
    cancelledBy?: string;
    confirmedAt?: string | Date;
    completedAt?: string | Date;
    bookingDate: string | Date;
    tableIds: string[];
    startTime: string;
    endTime: string;
    paymentStatus?: PaymentStatus;
    holdExpiresAt?: string | Date;
    depositAmount: number;
    depositStatus?: DepositStatus;
    tableDeposits?: ITableDepositSnapshot[];
    pricingSnapshot?: IPricingSnapshot;
    createdAt?: string | Date;
    updatedAt?: string | Date;

    checkInToken?: string;
    checkInCode?: string;
    checkedInAt?: string | Date;
}
