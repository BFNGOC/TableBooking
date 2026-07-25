import {
  PricingRuleType,
  PricingValueType,
} from '@app/modules/pricing-rule/schemas/pricing-rule.schema';
import {
  DepositStatus,
  DepositType,
} from '@app/modules/tables/schemas/table.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type BookingDocument = HydratedDocument<Booking>;

export enum BookingStatus {
  PENDING = 'PENDING',
  REJECTED = 'REJECTED',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  CHECKED_IN = 'CHECKED_IN',
  COMPLETED = 'COMPLETED',
  NO_SHOW = 'NO_SHOW',
}

export enum PaymentStatus {
  UNPAID = 'UNPAID',
  PAID = 'PAID',
  REFUNDED = 'REFUNDED',
}

@Schema({ _id: false })
class PriceAdjustment {
  @Prop({ type: Types.ObjectId })
  ruleId!: Types.ObjectId;

  @Prop()
  ruleName?: string;

  @Prop({
    type: String,
    enum: PricingRuleType,
  })
  type?: PricingRuleType;

  @Prop()
  value?: number;

  @Prop({
    type: String,
    enum: PricingValueType,
  })
  valueType?: PricingValueType;

  @Prop()
  amount?: number;
}

const PriceAdjustmentSchema = SchemaFactory.createForClass(PriceAdjustment);

@Schema({ _id: false })
class PricingSnapshot {
  @Prop()
  basePrice?: number;

  @Prop()
  finalPrice?: number;

  @Prop({
    type: [PriceAdjustmentSchema],
    default: [],
  })
  adjustments?: PriceAdjustment[];

  @Prop()
  calculatedAt?: Date;

  @Prop()
  depositAmount?: number;

  @Prop({
    type: String,
    enum: DepositStatus,
  })
  depositStatus?: DepositStatus;

  @Prop({
    type: String,
    enum: DepositType,
  })
  depositType?: DepositType;
}

const PricingSnapshotSchema = SchemaFactory.createForClass(PricingSnapshot);

@Schema({
  timestamps: true,
})
export class Booking {
  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
  })
  userId!: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: 'Restaurant',
    required: true,
  })
  restaurantId!: Types.ObjectId;

  @Prop({
    required: true,
  })
  guestCount!: number;

  @Prop({
    type: String,
    enum: BookingStatus,
    default: BookingStatus.PENDING,
  })
  status?: BookingStatus;

  @Prop()
  note?: string;

  @Prop()
  contactName?: string;

  @Prop()
  contactPhone?: string;

  @Prop()
  arrivedAt?: Date;

  @Prop()
  cancelReason?: string;

  @Prop({
    type: Types.ObjectId,
    ref: 'User',
  })
  cancelledBy?: Types.ObjectId;

  @Prop()
  confirmedAt?: Date;

  @Prop()
  completedAt?: Date;

  @Prop({
    required: true,
  })
  bookingDate!: Date;

  @Prop({
    type: [Types.ObjectId],
    ref: 'Table',
    required: true,
  })
  tableIds!: Types.ObjectId[];

  @Prop({
    required: true,
  })
  startTime!: string;

  @Prop({
    required: true,
  })
  endTime!: string;

  @Prop({
    type: String,
    enum: PaymentStatus,
    default: PaymentStatus.UNPAID,
  })
  paymentStatus?: PaymentStatus;

  @Prop()
  holdExpiresAt?: Date;

  @Prop({
    type: PricingSnapshotSchema, // ĐÃ SỬA: Sử dụng Schema vừa tạo thay vì Class
  })
  pricingSnapshot?: PricingSnapshot;
}

export const BookingSchema = SchemaFactory.createForClass(Booking);
