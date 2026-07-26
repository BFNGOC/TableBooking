import { Type } from 'class-transformer';
import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsString,
  Matches,
  Min,
} from 'class-validator';

export class GetAvailableTablesDto {
  @IsDateString()
  date!: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'startTime phải có định dạng HH:mm',
  })
  startTime!: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  guestCount!: number;
}
