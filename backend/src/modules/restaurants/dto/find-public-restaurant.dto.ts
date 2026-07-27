import {
  IsBooleanString,
  IsInt,
  IsOptional,
  IsString,
  IsArray,
  Max,
  Min,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { PaginationQueryDto } from '@app/shared/dto/pagination-query.dto';

export class FindPublicRestaurantDto extends PaginationQueryDto {
  @IsOptional()
  @IsString()
  keySearch?: string;

  @IsOptional()
  @Transform(({ value }) => {
    if (value == null) return undefined;
    if (Array.isArray(value)) return value.map((v) => String(v));
    return String(value)
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
  })
  @IsArray()
  @IsString({ each: true })
  cuisineTypes?: string[];

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  minPrice?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  maxPrice?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  capacity?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(5)
  minRating?: number;
}
