import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { RestaurantVerifyStatus } from '../schemas/restaurant.schema';

export class VerifyRestaurantDto {
  @ApiProperty({
    enum: RestaurantVerifyStatus,
  })
  @IsEnum(RestaurantVerifyStatus)
  verifyStatus!: RestaurantVerifyStatus;

  @ApiProperty({
    example: 'Thiếu giấy phép kinh doanh',
    required: false,
  })
  @IsOptional()
  @IsString()
  verifyNote?: string;
}
