import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { RestaurantStatus } from '../schemas/restaurant.schema';

export class UpdateRestaurantStatusDto {
  @ApiProperty({
    enum: RestaurantStatus,
  })
  @IsEnum(RestaurantStatus)
  status!: RestaurantStatus;
}
