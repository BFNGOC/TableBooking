import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  Max,
  Min,
  ValidateIf,
} from 'class-validator';
import {
  PricingAdjustmentType,
  PricingApplyType,
  PricingRuleType,
  PricingValueType,
} from '../schemas/pricing-rule.schema';

export class CreatePricingRuleDto {
  @ApiProperty({
    description: 'Tên quy tắc giá',
    example: 'Phụ thu cuối tuần',
  })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({
    description: 'Loại quy tắc',
    enum: PricingRuleType,
    example: PricingRuleType.WEEKEND,
  })
  @IsEnum(PricingRuleType)
  type!: PricingRuleType;

  @ApiProperty({
    description: 'Kiểu giá trị',
    enum: PricingValueType,
    example: PricingValueType.PERCENT,
  })
  @IsEnum(PricingValueType)
  valueType!: PricingValueType;

  @ApiProperty({
    description: 'Hướng điều chỉnh',
    enum: PricingAdjustmentType,
    example: PricingAdjustmentType.INCREASE,
  })
  @IsEnum(PricingAdjustmentType)
  adjustmentType!: PricingAdjustmentType;

  @ApiPropertyOptional({
    description: 'Phạm vi áp dụng',
    enum: PricingApplyType,
    example: PricingApplyType.ALL_TABLES,
  })
  @IsOptional()
  @IsEnum(PricingApplyType)
  applyType?: PricingApplyType = PricingApplyType.ALL_TABLES;

  @ApiPropertyOptional({
    description: 'Danh sách ID bàn áp dụng (khi applyType = TABLE)',
    example: ['64d89a3fbc9d2f001f001234'],
  })
  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  @ValidateIf((o) => o.applyType === PricingApplyType.TABLE)
  @ArrayNotEmpty()
  tableIds?: string[];

  @ApiPropertyOptional({
    description: 'Danh sách ID khu vực áp dụng (khi applyType = AREA)',
    example: ['64d89a3fbc9d2f001f001235'],
  })
  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  @ValidateIf((o) => o.applyType === PricingApplyType.AREA)
  @ArrayNotEmpty()
  areaIds?: string[];

  @ApiProperty({
    description: 'Giá trị tăng/giảm',
    example: 10,
  })
  @IsNumber()
  @Min(0)
  @ValidateIf((o) => o.valueType === PricingValueType.PERCENT)
  @Max(100)
  value!: number;

  @ApiPropertyOptional({
    description: 'Mức độ ưu tiên cao hơn thì áp dụng trước',
    example: 1,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  priority?: number = 0;

  @ApiPropertyOptional({
    description: 'Ngày bắt đầu hiệu lực',
    example: '2026-08-01',
  })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({
    description: 'Ngày kết thúc hiệu lực',
    example: '2026-08-31',
  })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiPropertyOptional({
    description: 'Giờ bắt đầu áp dụng (HH:mm)',
    example: '18:00',
  })
  @IsOptional()
  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/)
  startTime?: string;

  @ApiPropertyOptional({
    description: 'Giờ kết thúc áp dụng (HH:mm)',
    example: '21:00',
  })
  @IsOptional()
  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/)
  endTime?: string;

  @ApiPropertyOptional({
    description: 'Các ngày trong tuần áp dụng, 0=CN, 1=Thứ 2, ..., 6=Thứ 7',
    example: [0, 6],
  })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  @Type(() => Number)
  daysOfWeek?: number[];

  @ApiPropertyOptional({
    description: 'Kích hoạt quy tắc',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean = true;
}
