import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { UserRole } from '@app/modules/users/schemas/user.schema';

export type MessageDocument = HydratedDocument<Message>;

export enum ChatMessageType {
  TEXT = 'TEXT',
}

@Schema({ timestamps: true, collection: 'chat_messages' })
export class Message {
  @Prop({
    type: Types.ObjectId,
    ref: 'Conversation',
    required: true,
    index: true,
  })
  conversationId!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  senderId!: Types.ObjectId;

  @Prop({ type: String, enum: UserRole, required: true })
  senderRole!: UserRole;

  @Prop({ required: true, trim: true, maxlength: 2000 })
  content!: string;

  @Prop({ type: String, enum: ChatMessageType, default: ChatMessageType.TEXT })
  messageType!: ChatMessageType;

  @Prop({ trim: true })
  clientMessageId?: string;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
MessageSchema.index({ conversationId: 1, createdAt: -1 });
MessageSchema.index(
  { conversationId: 1, clientMessageId: 1 },
  { unique: true, sparse: true },
);
