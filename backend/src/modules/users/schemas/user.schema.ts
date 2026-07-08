import { ImageType } from '@app/modules/upload/types/image.type';
import { AutoFieldsPlugin } from '@app/plugins/auto-fields.plugin';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

export enum AccountType {
  LOCAL = 'LOCAL',
  GOOGLE = 'GOOGLE',
}

export enum UserRole {
  CUSTOMER = 'CUSTOMER',
  RESTAURANT = 'RESTAURANT',
  ADMIN = 'ADMIN',
}

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
}

@Schema({
  timestamps: true,
})
export class User {
  // Họ và tên
  @Prop({
    required: true,
    trim: true,
  })
  name!: string;

  // nameSearch
  @Prop({
    index: true,
    select: false,
  })
  nameSearch!: string;

  // Email
  @Prop({
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  })
  email!: string;

  // emailSearch
  @Prop({
    index: true,
    select: false,
  })
  emailSearch!: string;

  // Mật khẩu
  @Prop({
    select: false,
  })
  password?: string;

  // Loại tài khoản
  @Prop({
    type: String,
    enum: AccountType,
    default: AccountType.LOCAL,
  })
  accountType!: AccountType;

  // Vai trò
  @Prop({
    type: String,
    enum: UserRole,
    default: UserRole.CUSTOMER,
  })
  role!: UserRole;

  // Trạng thái active
  @Prop({
    default: false,
  })
  isActive!: boolean;

  // OTP
  @Prop()
  verificationCodeId?: string;

  @Prop()
  verificationCodeExpires?: Date;

  // Địa chỉ
  @Prop({
    trim: true,
    default: null,
  })
  address?: string;

  // Số điện thoại
  @Prop({
    trim: true,
    default: null,
  })
  phone?: string;

  // Avatar
  @Prop({
    type: ImageType,
    default: null,
  })
  avatar?: ImageType;

  // Refresh token
  @Prop({
    select: false,
    default: null,
  })
  refreshToken?: string;

  // Last login
  @Prop({
    default: null,
  })
  lastLoginAt?: Date;

  // Giới tính
  @Prop({
    type: String,
    enum: Gender,
    default: null,
  })
  gender?: Gender;

  @Prop({
    type: Date,
    default: null,
  })
  dateOfBirth?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.plugin(AutoFieldsPlugin, {
  search: ['name', 'email'],
});

// Index
UserSchema.index({ role: 1 });
UserSchema.index({ accountType: 1 });
UserSchema.index({ isActive: 1 });
UserSchema.index({ gender: 1 });
UserSchema.index({ birthYear: 1 });
