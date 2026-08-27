import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { DepositType, TableStatus } from '../schemas/table.schema';

export class CreateTableDto {
  @ApiProperty({
    description: 'ID khu vực',
    example: '687f4e91c1a7d5f8d4b4b123',
  })
  @IsMongoId()
  areaId!: string;

  @ApiPropertyOptional({
    description: 'Số hiệu bàn do người dùng nhập (bỏ trống để tự sinh)',
    example: 'A01',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  tableNumber?: string;

  @ApiProperty({
    description: 'Sức chứa',
    example: 4,
  })
  @IsNumber()
  @Min(1)
  @Max(100)
  capacity!: number;

  @ApiPropertyOptional({
    example: 120,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  x?: number;

  @ApiPropertyOptional({
    example: 250,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  y?: number;

  @ApiPropertyOptional({
    enum: TableStatus,
  })
  @IsOptional()
  @IsEnum(TableStatus)
  status?: TableStatus;

  @ApiPropertyOptional({
    example: 'Bàn gần cửa sổ',
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  description?: string;

  @ApiPropertyOptional({
    example: 500000,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  basePrice?: number;

  @ApiPropertyOptional({
    example: 100000,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  depositAmount?: number;

  @ApiPropertyOptional({
    enum: DepositType,
  })
  @IsOptional()
  @IsEnum(DepositType)
  depositType?: DepositType;
}
