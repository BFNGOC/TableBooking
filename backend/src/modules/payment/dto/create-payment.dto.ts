import { IsEnum, IsMongoId } from 'class-validator';
import { PaymentMethod, PaymentType } from '../schemas/payment.schema';

export class CreatePaymentDto {
  @IsMongoId()
  bookingId!: string;

  @IsEnum(PaymentType)
  type!: PaymentType;

  @IsEnum(PaymentMethod)
  method!: PaymentMethod;
}
