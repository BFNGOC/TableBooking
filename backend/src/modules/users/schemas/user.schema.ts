import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

export enum AccountType {
  LOCAL = 'LOCAL',
  GOOGLE = 'GOOGLE',
}

export enum UserRole {
  CUSTOMER = 'CUSTOMER',
  OWNER = 'OWNER',
  ADMIN = 'ADMIN',
}

@Schema({
  timestamps: true,
})
export class User {
  @Prop({
    required: true,
    trim: true,
  })
  name!: string;

  @Prop({
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  })
  email!: string;

  @Prop()
  password?: string;

  @Prop()
  phone?: string;

  @Prop()
  address?: string;

  @Prop()
  avatar?: string;

  @Prop({
    type: String,
    enum: UserRole,
    default: UserRole.CUSTOMER,
  })
  role!: UserRole;

  @Prop({
    type: String,
    enum: AccountType,
    default: AccountType.LOCAL,
  })
  accountType!: AccountType;

  @Prop({
    default: false,
  })
  isActive!: boolean;

  @Prop()
  verificationCodeId?: string;

  @Prop()
  verificationCodeExpires?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
