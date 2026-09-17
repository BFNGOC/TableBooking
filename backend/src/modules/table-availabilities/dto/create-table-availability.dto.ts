import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsDateString,
  IsInt,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { PartialType } from '@nestjs/swagger';

class TimeSlotDto {
  @IsString()
  @IsNotEmpty()
  startTime!: string;

  @IsString()
  @IsNotEmpty()
  endTime!: string;
}

class WeeklySlotDto {
  @IsInt()
  @Min(0)
  @Max(6)
  dayOfWeek!: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => TimeSlotDto)
  slots!: TimeSlotDto[];
}

class ExceptionSlotDto {
  @IsDateString()
  date!: string;

  @IsString()
  @IsOptional()
  reason?: string;

  @IsBoolean()
  @IsOptional()
  isClosed?: boolean;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TimeSlotDto)
  @IsOptional()
  slots?: TimeSlotDto[];
}

export class CreateTableAvailabilityDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsMongoId({ each: true })
  tableIds!: string[];

  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => WeeklySlotDto)
  weeklySlots!: WeeklySlotDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ExceptionSlotDto)
  @IsOptional()
  exceptions?: ExceptionSlotDto[];
}
