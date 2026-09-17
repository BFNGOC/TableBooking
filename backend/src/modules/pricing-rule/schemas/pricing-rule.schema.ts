import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type PricingRuleDocument = HydratedDocument<PricingRule>;

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

@Schema({
  timestamps: true,
})
export class PricingRule {
  @Prop({
    type: Types.ObjectId,
    ref: 'Restaurant',
    required: true,
    index: true,
  })
  restaurantId!: Types.ObjectId;

  @Prop({
    required: true,
    trim: true,
  })
  name!: string;

  @Prop({
    enum: PricingRuleType,
    required: true,
  })
  type!: PricingRuleType;

  @Prop({
    enum: PricingValueType,
    required: true,
  })
  valueType!: PricingValueType;

  @Prop({
    enum: PricingApplyType,
    default: PricingApplyType.ALL_TABLES,
  })
  applyType!: PricingApplyType;

  @Prop({
    type: [Types.ObjectId],
    ref: 'Table',
    default: [],
  })
  tableIds!: Types.ObjectId[];

  @Prop({
    type: [Types.ObjectId],
    ref: 'Area',
    default: [],
  })
  areaIds!: Types.ObjectId[];

  @Prop({
    required: true,
    min: 0,
  })
  value!: number;

  @Prop({
    default: 0,
    min: 0,
  })
  priority!: number;

  @Prop()
  startDate?: Date;

  @Prop()
  endDate?: Date;

  @Prop()
  startTime?: string;

  @Prop()
  endTime?: string;

  @Prop({
    type: [Number],
    default: [],
  })
  daysOfWeek!: number[];

  @Prop({
    default: true,
    index: true,
  })
  isActive!: boolean;

  @Prop({
    enum: PricingAdjustmentType,
    required: true,
  })
  adjustmentType!: PricingAdjustmentType;
}

export const PricingRuleSchema = SchemaFactory.createForClass(PricingRule);
