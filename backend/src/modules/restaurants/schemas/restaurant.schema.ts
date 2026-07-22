import { ImageType } from '@app/modules/upload/types/image.type';
import { AutoSlugPlugin } from '@app/plugins/auto-slug.plugin';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type RestaurantDocument = HydratedDocument<Restaurant>;

export enum RestaurantStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export enum RestaurantVerifyStatus {
  EMAIL_PENDING = 'EMAIL_PENDING',
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export enum SocialLinkType {
  FACEBOOK = 'FACEBOOK',
  INSTAGRAM = 'INSTAGRAM',
  TIKTOK = 'TIKTOK',
  WEBSITE = 'WEBSITE',
}

@Schema({ _id: false })
export class SocialLink {
  @Prop({
    required: true,
    enum: SocialLinkType,
  })
  type!: SocialLinkType;

  @Prop({
    required: true,
    trim: true,
  })
  url!: string;
}

export const SocialLinkSchema = SchemaFactory.createForClass(SocialLink);

@Schema({
  timestamps: true,
  collection: 'restaurants',
})
export class Restaurant {
  /**
   * ============================================================
   * Basic Information
   * ============================================================
   */

  @Prop({
    required: true,
    unique: true,
    uppercase: true,
    trim: true,
  })
  restaurantCode!: string;

  @Prop({
    required: true,
    trim: true,
  })
  restaurantName!: string;

  @Prop({
    default: '',
    trim: true,
  })
  description?: string;

  @Prop({
    default: 0,
    min: 0,
    max: 5,
  })
  rating?: number;

  /**
   * ============================================================
   * Business Contact
   * ============================================================
   */

  @Prop({
    trim: true,
  })
  phone?: string;

  @Prop({
    trim: true,
    lowercase: true,
  })
  email?: string;

  @Prop({
    trim: true,
  })
  address?: string;

  /**
   * Người đại diện pháp luật / người đại diện nhà hàng
   */
  @Prop({
    trim: true,
  })
  representativeName?: string;

  /**
   * Loại hình ẩm thực
   * Ví dụ:
   * ["BBQ", "Lẩu", "Hải sản"]
   */
  @Prop({
    type: [String],
    default: [],
  })
  cuisineTypes?: string[];

  /**
   * ============================================================
   * Business Information
   * ============================================================
   */

  @Prop({
    default: '',
    trim: true,
    unique: true,
  })
  taxCode?: string;

  /**
   * Khoảng giá trung bình
   * (VNĐ / người)
   */
  @Prop({
    min: 0,
  })
  priceFrom?: number;

  @Prop({
    min: 0,
  })
  priceTo?: number;

  /**
   * Sức chứa tối đa
   */
  @Prop({
    min: 1,
  })
  capacity?: number;

  /**
   * Website, Facebook, Instagram...
   */
  @Prop({
    type: [SocialLinkSchema],
    default: [],
  })
  socialLinks?: SocialLink[];

  /**
   * ============================================================
   * Operating Hours
   * ============================================================
   */

  @Prop()
  openingTime?: string;

  @Prop()
  closingTime?: string;

  /**
   * ============================================================
   * Media
   * ============================================================
   */

  @Prop({
    type: ImageType,
    default: null,
  })
  avatar?: ImageType;

  @Prop({
    type: [ImageType],
    default: [],
  })
  images?: ImageType[];

  /**
   * ============================================================
   * Verification
   * ============================================================
   */

  /**
   * Trạng thái xác minh
   */
  @Prop({
    enum: RestaurantVerifyStatus,
    default: RestaurantVerifyStatus.EMAIL_PENDING,
  })
  verifyStatus?: RestaurantVerifyStatus;

  /**
   * Ghi chú của admin khi từ chối hoặc yêu cầu bổ sung
   */
  @Prop({
    trim: true,
    default: '',
  })
  verifyNote?: string;

  /**
   * Thời điểm user gửi yêu cầu đăng ký nhà hàng
   */

  @Prop()
  onboardingRequestedAt?: Date;

  /**
   * ============================================================
   * System
   * ============================================================
   */

  /**
   * Trạng thái hoạt động
   */
  @Prop({
    enum: RestaurantStatus,
    default: RestaurantStatus.ACTIVE,
  })
  status?: RestaurantStatus;

  @Prop({
    default: true,
  })
  isAcceptingBookings?: boolean;

  @Prop({
    default: 60,
    min: 0,
  })
  minBookingNoticeMinutes?: number;

  @Prop({
    default: 15,
    min: 1,
  })
  tableHoldMinutes?: number;

  @Prop({
    default: true,
  })
  allowSameDayBooking?: boolean;

  @Prop({
    default: 30,
    min: 1,
  })
  advanceBookingDays?: number;

  /**
   * Chủ sở hữu nhà hàng
   */
  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  })
  userId!: Types.ObjectId;

  // OTP
  @Prop()
  verificationCodeId?: string;

  @Prop()
  verificationCodeExpires?: Date;

  @Prop({
    unique: true,
    index: true,
  })
  slug!: string;
}

export const RestaurantSchema = SchemaFactory.createForClass(Restaurant);

RestaurantSchema.plugin(AutoSlugPlugin, {
  slug: ['restaurantName'],
});
