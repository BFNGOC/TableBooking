import {
  IsArray,
  IsDateString,
  IsInt,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Matches,
  Min,
} from 'class-validator';

export class CreateBookingDto {
  @IsDateString()
  bookingDate!: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'startTime phải có định dạng HH:mm',
  })
  startTime!: string;

  @IsInt()
  @Min(1)
  guestCount!: number;

  @IsArray()
  @IsMongoId({ each: true })
  @IsNotEmpty()
  tableIds!: string[];

  @IsOptional()
  @IsString()
  restaurantNote?: string;

  @IsString()
  @IsNotEmpty()
  contactName!: string;

  @IsString()
  @IsNotEmpty()
  contactPhone!: string;

  payDepositNow?: boolean;
}
