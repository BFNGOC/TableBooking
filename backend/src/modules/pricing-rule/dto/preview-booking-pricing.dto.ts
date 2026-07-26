import {
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsString,
  Matches,
  ArrayNotEmpty,
} from 'class-validator';

export class PreviewBookingPricingDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  tableIds!: string[];

  @IsDateString()
  bookingDate!: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'startTime phải có định dạng HH:mm',
  })
  startTime!: string;
}
