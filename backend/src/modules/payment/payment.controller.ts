import { Body, Controller, Get, Post, Query, Req, Res } from '@nestjs/common';
import type { Request } from 'express';
import { PaymentService } from './payment.service';
import { CurrentUser } from '@app/decorator/current-user.decorator';
import type { AuthUser } from '@app/auth/types/auth-jwt-user.type';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { Public } from '@app/decorator/customize';
import type { ReturnQueryFromVNPay } from 'vnpay';
import { ConfigService } from '@nestjs/config';
import type { Response } from 'express';

@Controller('payment')
export class PaymentController {
  constructor(
    private readonly paymentService: PaymentService,
    private readonly configService: ConfigService,
  ) {}

  @Post()
  async createPayment(
    @Req() req: Request,
    @CurrentUser() user: AuthUser,
    @Body() dto: CreatePaymentDto,
  ) {
    const ipAddress =
      req.ip ||
      req.headers['x-forwarded-for']?.toString().split(',')[0] ||
      '127.0.0.1';

    return this.paymentService.createPayment(user._id, dto, ipAddress);
  }

  @Get('vnpay/ipn')
  @Public()
  async handleVnpayIpn(
    @Query() query: ReturnQueryFromVNPay,
    @Res() res: Response,
  ) {
    const result = await this.paymentService.handleVnpayIpn(query);

    const frontendUrl = this.configService.getOrThrow<string>('FRONTEND_URL');

    return res.redirect(`${frontendUrl}/checkout/${result.paymentId}`);
  }
}
