import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type TableDocument = HydratedDocument<Table>;

export enum TableStatus {
  AVAILABLE = 'AVAILABLE',
  MAINTENANCE = 'MAINTENANCE',
  DISABLED = 'DISABLED',
}

export enum DepositType {
  NONE = 'NONE',
  FIXED = 'FIXED',
  PERCENT = 'PERCENT',
}

@Schema({
  timestamps: true,
})
export class Table {
  @Prop({
    type: Types.ObjectId,
    ref: 'Restaurant',
    required: true,
    index: true,
  })
  restaurantId!: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: 'Area',
  })
  areaId?: Types.ObjectId;

  @Prop()
  x?: number;

  @Prop()
  y?: number;

  @Prop({
    required: true,
  })
  tableNumber!: string;

  @Prop({
    required: true,
    min: 1,
  })
  capacity!: number;

  @Prop({
    enum: TableStatus,
    default: TableStatus.AVAILABLE,
  })
  status?: TableStatus;

  @Prop()
  description?: string;

  @Prop({
    default: 0,
    min: 0,
  })
  basePrice!: number;

  @Prop({
    default: 0,
  })
  depositAmount?: number;

  @Prop({
    enum: DepositType,
    default: DepositType.NONE,
  })
  depositType?: DepositType;
}

export const TableSchema = SchemaFactory.createForClass(Table);
