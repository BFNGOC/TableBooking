import { PaginationQueryDto } from '@app/shared/dto/pagination-query.dto';
import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';

import {
  BookingStatus,
  DepositStatus,
  PaymentStatus,
} from '../schemas/booking.schema';

export class FindRestaurantBookingDto extends PaginationQueryDto {
  /**
   * Search:
   * - contactName
   * - contactPhone
   */
  @IsOptional()
  @IsString()
  keySearch?: string;

  /**
   * Booking status
   */
  @IsOptional()
  @IsEnum(BookingStatus)
  status?: BookingStatus;

  /**
   * Payment status
   */
  @IsOptional()
  @IsEnum(PaymentStatus)
  paymentStatus?: PaymentStatus;

  /**
   * Deposit status
   */
  @IsOptional()
  @IsEnum(DepositStatus)
  depositStatus?: DepositStatus;

  /**
   * Booking date from
   */
  @IsOptional()
  @IsDateString()
  fromDate?: string;

  /**
   * Booking date to
   */
  @IsOptional()
  @IsDateString()
  toDate?: string;
}
