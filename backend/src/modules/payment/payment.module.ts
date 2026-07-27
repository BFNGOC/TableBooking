import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Payment, PaymentSchema } from './schemas/payment.schema';
import { BookingsModule } from '../bookings/bookings.module';
import { VnpayService } from './vnpay.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Payment.name, schema: PaymentSchema }]),
    BookingsModule,
  ],
  controllers: [PaymentController],
  providers: [PaymentService, VnpayService],
  exports: [VnpayService],
})
export class PaymentModule {}
