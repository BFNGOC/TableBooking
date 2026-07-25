import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type TableAvailabilityDocument = HydratedDocument<TableAvailability>;

export enum DayOfWeek {
  SUNDAY = 0,
  MONDAY = 1,
  TUESDAY = 2,
  WEDNESDAY = 3,
  THURSDAY = 4,
  FRIDAY = 5,
  SATURDAY = 6,
}

@Schema({ _id: false })
class TimeSlot {
  @Prop({ required: true })
  startTime!: string;

  @Prop({ required: true })
  endTime!: string;
}
const TimeSlotSchema = SchemaFactory.createForClass(TimeSlot);

@Schema({ _id: false })
class WeeklySlot {
  @Prop({
    type: Number,
    required: true,
    enum: Object.values(DayOfWeek).filter((v) => typeof v === 'number'),
  })
  dayOfWeek!: DayOfWeek;

  @Prop({ default: true })
  isActive!: boolean;

  @Prop({
    type: [TimeSlotSchema],
    default: [],
  })
  slots!: TimeSlot[];
}
const WeeklySlotSchema = SchemaFactory.createForClass(WeeklySlot);

@Schema({ _id: false })
class ExceptionSlot {
  @Prop({
    type: Date,
    required: true,
  })
  date!: Date;

  @Prop()
  reason?: string;

  @Prop({ default: false })
  isClosed!: boolean;

  @Prop({
    type: [TimeSlotSchema],
    default: [],
  })
  slots!: TimeSlot[];
}
const ExceptionSlotSchema = SchemaFactory.createForClass(ExceptionSlot);

@Schema({
  timestamps: true,
})
export class TableAvailability {
  @Prop({
    type: [Types.ObjectId],
    ref: 'Table',
    required: true,
  })
  tableIds!: Types.ObjectId[];

  @Prop({
    type: Types.ObjectId,
    ref: 'Restaurant',
    required: true,
    index: true,
  })
  restaurantId!: Types.ObjectId;

  @Prop({
    type: [WeeklySlotSchema],
    default: [],
  })
  weeklySlots!: WeeklySlot[];

  @Prop({
    type: [ExceptionSlotSchema],
    default: [],
  })
  exceptions!: ExceptionSlot[];
}

export const TableAvailabilitySchema =
  SchemaFactory.createForClass(TableAvailability);
