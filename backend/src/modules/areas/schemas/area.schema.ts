import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type AreaDocument = HydratedDocument<Area>;

@Schema({
  timestamps: true,
})
export class Area {
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

  @Prop()
  description?: string;
}

export const AreaSchema = SchemaFactory.createForClass(Area);
