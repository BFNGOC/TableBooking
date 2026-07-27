import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type PaymentDocument = HydratedDocument<Payment>;

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

@Schema({
  timestamps: true,
  collection: 'payments',
})
export class Payment {
  @Prop({
    type: Types.ObjectId,
    ref: 'Booking',
    required: true,
    index: true,
  })
  bookingId!: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  })
  userId!: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: 'Restaurant',
    required: true,
    index: true,
  })
  restaurantId!: Types.ObjectId;

  // Số tiền thực tế thanh toán
  @Prop({
    required: true,
    min: 0,
  })
  amount!: number;

  // DEPOSIT hoặc FULL
  @Prop({
    required: true,
    enum: PaymentType,
    index: true,
  })
  type!: PaymentType;

  @Prop({
    required: true,
    enum: PaymentMethod,
  })
  method!: PaymentMethod;

  @Prop({
    required: true,
    enum: PaymentTransactionStatus,
    default: PaymentTransactionStatus.PENDING,
  })
  status!: PaymentTransactionStatus;

  // Mã giao dịch từ payment provider
  @Prop()
  transactionId?: string;

  // Mã order của hệ thống
  @Prop({
    required: true,
    unique: true,
    index: true,
  })
  orderCode!: string;

  @Prop()
  paymentUrl?: string;

  @Prop()
  expiresAt?: Date;

  @Prop({
    type: Object,
  })
  providerData?: Record<string, any>;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
