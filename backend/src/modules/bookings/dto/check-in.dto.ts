import { IsOptional, IsString } from 'class-validator';

export class CheckInBookingDto {
  @IsOptional()
  @IsString()
  checkInToken?: string;

  @IsOptional()
  @IsString()
  checkInCode?: string;
}
