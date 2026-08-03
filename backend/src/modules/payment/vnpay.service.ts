import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  VNPay,
  ProductCode,
  VnpLocale,
  HashAlgorithm,
  ReturnQueryFromVNPay,
} from 'vnpay';

@Injectable()
export class VnpayService {
  private readonly vnpay: VNPay;

  constructor(private readonly configService: ConfigService) {
    this.vnpay = new VNPay({
      tmnCode: this.configService.getOrThrow<string>('VNPAY_TMN_CODE'),

      secureSecret: this.configService.getOrThrow<string>('VNPAY_HASH_SECRET'),

      vnpayHost: this.configService.getOrThrow<string>('VNPAY_PAYMENT_URL'),

      testMode: true,

      hashAlgorithm: HashAlgorithm.SHA512,
    });
  }

  createPaymentUrl(params: {
    orderCode: string;
    amount: number;
    orderInfo: string;
    ipAddr: string;
    returnUrl: string;
  }) {
    return this.vnpay.buildPaymentUrl({
      vnp_Amount: params.amount,
      vnp_TxnRef: params.orderCode,
      vnp_OrderInfo: params.orderInfo,
      vnp_OrderType: ProductCode.Other,
      vnp_IpAddr: params.ipAddr,
      vnp_ReturnUrl: params.returnUrl,
      vnp_Locale: VnpLocale.VN,
    });
  }

  verifyIpn(query: ReturnQueryFromVNPay) {
    return this.vnpay.verifyIpnCall(query);
  }
}
