import {
  IsArray,
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

class SocialLinkDto {
  @ApiPropertyOptional({
    example: 'Facebook',
  })
  type!: string;

  @ApiPropertyOptional({
    example: 'https://facebook.com/demo',
  })
  @IsUrl()
  url!: string;
}

export class UpdateRestaurantProfileDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

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

  @ApiPropertyOptional()
  @IsOptional()
  @Min(0)
  priceFrom?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Min(0)
  priceTo?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(1)
  capacity?: number;

  @ApiPropertyOptional({
    type: ImageType,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => ImageType)
  avatar?: ImageType;

  @ApiPropertyOptional({
    type: [ImageType],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ImageType)
  images?: ImageType[];

  @ApiPropertyOptional({
    type: [SocialLinkDto],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SocialLinkDto)
  socialLinks?: SocialLinkDto[];
}
