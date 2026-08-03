export enum PaymentTransactionStatus {
    PENDING = 'PENDING',
    PAID = 'PAID',
    FAILED = 'FAILED',
    CANCELLED = 'CANCELLED',
    EXPIRED = 'EXPIRED',
}

export enum PaymentMethod {
    VNPAY = 'VNPAY',
    MOMO = 'MOMO',
    CASH = 'CASH',
}

export enum PaymentType {
    DEPOSIT = 'DEPOSIT',
    FULL = 'FULL',
}

export interface IPayment {
    _id?: string;
    bookingId: string;
    userId: string;
    restaurantId: string;
    amount: number;
    type: PaymentType;
    method: PaymentMethod;
    status: PaymentTransactionStatus;
    transactionId?: string;
    orderCode: string;
    paymentUrl?: string;
    expiresAt?: string | Date;
    providerData?: Record<string, unknown>;
    createdAt?: string | Date;
    updatedAt?: string | Date;
}
