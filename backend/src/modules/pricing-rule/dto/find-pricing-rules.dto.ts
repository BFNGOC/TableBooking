import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import {
  PricingApplyType,
  PricingRuleType,
} from '../schemas/pricing-rule.schema';

export class FindPricingRulesDto {
  @ApiPropertyOptional({
    description: 'Số trang (1-indexed)',
    example: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Số bản ghi trên mỗi trang',
    example: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @ApiPropertyOptional({
    description: 'Sắp xếp theo field: priority, name, createdAt',
    example: 'priority',
  })
  @IsOptional()
  @IsString()
  sortBy?: string = 'priority';

  @ApiPropertyOptional({
    description: 'Hướng sắp xếp: asc hoặc desc',
    example: 'desc',
  })
  @IsOptional()
  @IsString()
  sortOrder?: 'asc' | 'desc' = 'desc';

  @ApiPropertyOptional({
    description: 'Tìm kiếm theo tên rule',
    example: 'Phụ thu',
  })
  @IsOptional()
  @IsString()
  keyword?: string;

  @ApiPropertyOptional({
    description: 'Lọc theo loại rule',
    enum: PricingRuleType,
  })
  @IsOptional()
  @IsEnum(PricingRuleType)
  type?: PricingRuleType;

  @ApiPropertyOptional({
    description: 'Lọc theo phạm vi áp dụng',
    enum: PricingApplyType,
  })
  @IsOptional()
  @IsEnum(PricingApplyType)
  applyType?: PricingApplyType;

  @ApiPropertyOptional({
    description: 'Lọc theo trạng thái kích hoạt',
    example: true,
  })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isActive?: boolean;
}
