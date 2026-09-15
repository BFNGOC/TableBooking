import { ImageType } from '@app/modules/upload/types/image.type';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ReviewDocument = HydratedDocument<Review>;

@Schema({ _id: false })
export class ReviewReply {
  @Prop({ required: true, trim: true, maxlength: 500 })
  content!: string;

  @Prop({ type: Date, default: Date.now })
  repliedAt!: Date;
}

export const ReviewReplySchema = SchemaFactory.createForClass(ReviewReply);

@Schema({
  timestamps: true,
  collection: 'reviews',
})
export class Review {
  @Prop({
    type: Types.ObjectId,
    ref: 'Booking',
    required: true,
    unique: true,
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

  @Prop({
    required: true,
    min: 1,
    max: 5,
  })
  rating!: number;

  @Prop({ trim: true, maxlength: 1000 })
  comment?: string;

  // Tái sử dụng ImageType đã có trong hệ thống
  @Prop({ type: [ImageType], default: [] })
  images!: ImageType[];

  // Reply từ phía nhà hàng (chỉ nhà hàng mới được reply)
  @Prop({ type: ReviewReplySchema, default: null })
  restaurantReply?: ReviewReply | null;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);

ReviewSchema.index({ restaurantId: 1, createdAt: -1 });
ReviewSchema.index({ userId: 1, createdAt: -1 });
