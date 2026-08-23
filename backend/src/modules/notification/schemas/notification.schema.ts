import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type NotificationDocument = HydratedDocument<Notification>;

export enum NotificationType {
  BOOKING = 'BOOKING',
  PAYMENT = 'PAYMENT',
  REVIEW = 'REVIEW',
  SYSTEM = 'SYSTEM',
  GENERAL = 'GENERAL',
}

export enum NotificationReferenceModel {
  BOOKING = 'Booking',
  PAYMENT = 'Payment',
  RESTAURANT = 'Restaurant',
  REVIEW = 'Review',
}

@Schema({
  timestamps: true,
  collection: 'notifications',
})
export class Notification {
  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
  })
  userId!: Types.ObjectId;

  @Prop({
    type: String,
    enum: NotificationType,
    default: NotificationType.GENERAL,
    required: true,
  })
  type!: NotificationType;

  @Prop({
    type: String,
    required: true,
    trim: true,
  })
  title!: string;

  @Prop({
    type: String,
    required: true,
    trim: true,
  })
  message!: string;

  @Prop({
    type: Types.ObjectId,
    refPath: 'referenceModel',
    default: null,
  })
  referenceId?: Types.ObjectId;

  @Prop({
    type: String,
    enum: NotificationReferenceModel,
    default: null,
  })
  referenceModel?: string;

  @Prop({
    type: Object,
    default: {},
  })
  data?: Record<string, any>;

  @Prop({
    type: Boolean,
    default: false,
  })
  isRead!: boolean;

  @Prop({
    type: Date,
    default: null,
  })
  readAt?: Date;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);

NotificationSchema.index({
  recipientId: 1,
  createdAt: -1,
});

NotificationSchema.index({
  recipientId: 1,
  isRead: 1,
  createdAt: -1,
});
