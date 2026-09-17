import {
  IsArray,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { ImageType } from '@app/modules/upload/types/image.type';
import { SocialLinkType } from '../schemas/restaurant.schema';

class SocialLinkDto {
  @IsEnum(SocialLinkType)
  type!: SocialLinkType;

  @IsUrl()
  url!: string;
}

export class UpdateRestaurantProfileDto {
  /**
   * ============================================================
   * Basic Information
   * ============================================================
   */
  @ApiPropertyOptional({
    example: 'Lẩu Nhà Mình',
  })
  @IsOptional()
  @IsString()
  restaurantName?: string;

  @ApiPropertyOptional({
    example: 'Nhà hàng chuyên các món lẩu và nướng BBQ',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    example: ['BBQ', 'Lẩu', 'Hải sản'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  cuisineTypes?: string[];

  /**
   * ============================================================
   * Business Contact
   * ============================================================
   */

  @ApiPropertyOptional({
    example: '0901234567',
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({
    example: 'contact@nhahangdemo.com',
  })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiPropertyOptional({
    example: '123 Nguyễn Văn A, Quận 1, TP.HCM',
  })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({
    example: 'Nguyễn Văn A',
  })
  @IsOptional()
  @IsString()
  representativeName?: string;

  /**
   * ============================================================
   * Business Information
   * ============================================================
   */

  /**
   * Khoảng giá trung bình
   * (VNĐ / người)
   */
  @ApiPropertyOptional({
    example: 100000,
    minimum: 0,
  })
  @IsOptional()
  @Min(0)
  priceFrom?: number;

  @ApiPropertyOptional({
    example: 500000,
    minimum: 0,
  })
  @IsOptional()
  @Min(0)
  priceTo?: number;

  /**
   * Sức chứa tối đa
   */
  @ApiPropertyOptional({
    example: 100,
    minimum: 1,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  capacity?: number;

  /**
   * ============================================================
   * Operating Hours
   * ============================================================
   */

  @ApiPropertyOptional({
    example: '08:00',
  })
  @IsOptional()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
  openingTime?: string;

  @ApiPropertyOptional({
    example: '22:00',
  })
  @IsOptional()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
  closingTime?: string;

  /**
   * ============================================================
   * Media
   * ============================================================
   */

  @ApiPropertyOptional({
    type: ImageType,
  })
  @IsOptional()
  avatar?: ImageType;

  @ApiPropertyOptional({
    type: [ImageType],
  })
  @IsOptional()
  @IsArray()
  images?: ImageType[];

  /**
   * ============================================================
   * Social Links
   * ============================================================
   */

  @ApiPropertyOptional({
    type: [SocialLinkDto],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SocialLinkDto)
  socialLinks?: SocialLinkDto[];
}
