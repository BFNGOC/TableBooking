import { IsDateString, IsMongoId, IsOptional, IsString } from 'class-validator';

export class FindTableAvailabilityDto {
  @IsMongoId()
  @IsOptional()
  restaurantId?: string;

  @IsDateString()
  @IsOptional()
  date?: string;

  @IsString()
  @IsOptional()
  tableId?: string;
}
