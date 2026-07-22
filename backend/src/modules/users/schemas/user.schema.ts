import { ImageType } from '@app/modules/upload/types/image.type';
import { AutoSlugPlugin } from '@app/plugins/auto-slug.plugin';
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

  // Email
  @Prop({
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  })
  email!: string;

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

  @Prop({
    unique: true,
    sparse: true,
    index: true,
  })
  googleId?: string;

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

  @Prop({
    default: '',
    index: true,
  })
  slug!: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.plugin(AutoSlugPlugin, {
  slug: ['name'],
});

// Index
UserSchema.index({ role: 1 });
UserSchema.index({ accountType: 1 });
UserSchema.index({ isActive: 1 });
UserSchema.index({ gender: 1 });
