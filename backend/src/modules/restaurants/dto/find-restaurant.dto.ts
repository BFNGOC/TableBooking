import { PaginationQueryDto } from '@app/shared/dto/pagination-query.dto';
import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';
import {
  RestaurantStatus,
  RestaurantVerifyStatus,
} from '../schemas/restaurant.schema';

export class FindRestaurantAdminDto extends PaginationQueryDto {
  //search representativeName, restaurantName
  @IsOptional()
  @IsString()
  keySearch?: string;

  @IsOptional()
  @IsString()
  restaurantCode?: string;

  @IsOptional()
  @IsString()
  taxCode?: string;

  @IsOptional()
  @IsEnum(RestaurantVerifyStatus)
  verifyStatus?: RestaurantVerifyStatus;

  @IsOptional()
  @IsEnum(RestaurantStatus)
  status?: RestaurantStatus;

  @IsOptional()
  @IsDateString()
  fromDate?: string;

  @IsOptional()
  @IsDateString()
  toDate?: string;
}
