import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import {
  VNPay,
  ProductCode,
  VnpLocale,
  HashAlgorithm,
  ReturnQueryFromVNPay,
} from 'vnpay';
import * as crypto from 'crypto';

interface RefundParams {
  orderCode: string;
  transactionId: string;
  amount: number;
  transactionDate: string;
  createBy?: string;
  ipAddr?: string;
}

@Injectable()
export class VnpayService {
  private readonly vnpay: VNPay;

  private readonly tmnCode: string;
  private readonly secureSecret: string;
  private readonly refundUrl: string;

  constructor(private readonly configService: ConfigService) {
    this.tmnCode = this.configService.getOrThrow<string>('VNPAY_TMN_CODE');

    this.secureSecret =
      this.configService.getOrThrow<string>('VNPAY_HASH_SECRET');

    this.refundUrl = this.configService.getOrThrow<string>('VNPAY_REFUND_URL');

    this.vnpay = new VNPay({
      tmnCode: this.tmnCode,

      secureSecret: this.secureSecret,

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

  async refund(params: RefundParams) {
    const {
      orderCode,
      transactionId,
      amount,
      transactionDate,
      createBy = 'admin',
      ipAddr = '127.0.0.1',
    } = params;

    if (!orderCode) {
      throw new BadRequestException('Thiếu orderCode');
    }

    if (!transactionId) {
      throw new BadRequestException('Thiếu transactionId');
    }

    if (!amount || amount <= 0) {
      throw new BadRequestException('Số tiền refund không hợp lệ');
    }

    if (!transactionDate) {
      throw new BadRequestException('Thiếu transactionDate');
    }

    // ============================================
    // VNPAY REFUND
    // ============================================

    const requestId = this.generateRequestId();

    const version = '2.1.0';
    const command = 'refund';

    // Refund toàn bộ payment
    const transactionType = '02';

    // VNPAY dùng đơn vị 1/100 VND
    const vnpAmount = Math.round(amount * 100);

    const createDate = this.formatVnpayDate(new Date());

    const orderInfo = `Hoan tien giao dich ${orderCode}`;

    // ============================================
    // CREATE SECURE HASH
    // ============================================

    const hashData = [
      requestId,
      version,
      command,
      this.tmnCode,
      transactionType,
      orderCode,
      vnpAmount,
      transactionId,
      transactionDate,
      createBy,
      createDate,
      ipAddr,
      orderInfo,
    ].join('|');

    const secureHash = crypto
      .createHmac('sha512', this.secureSecret)
      .update(hashData, 'utf-8')
      .digest('hex');

    // ============================================
    // REQUEST BODY
    // ============================================

    const body = {
      vnp_RequestId: requestId,
      vnp_Version: version,
      vnp_Command: command,
      vnp_TmnCode: this.tmnCode,

      vnp_TransactionType: transactionType,

      // Mã order lúc thanh toán
      vnp_TxnRef: orderCode,

      // amount * 100
      vnp_Amount: vnpAmount,

      // transaction number VNPAY
      vnp_TransactionNo: transactionId,

      // Thời gian giao dịch gốc
      vnp_TransactionDate: transactionDate,

      vnp_CreateBy: createBy,

      vnp_CreateDate: createDate,

      vnp_IpAddr: ipAddr,

      vnp_OrderInfo: orderInfo,

      vnp_SecureHash: secureHash,
    };

    try {
      const response = await axios.post(this.refundUrl, body, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 15000,
      });

      const data = response.data;

      return {
        responseCode: data.vnp_ResponseCode,
        message: data.vnp_Message,

        transactionId: data.vnp_TransactionNo,

        transactionStatus: data.vnp_TransactionStatus,

        transactionType: data.vnp_TransactionType,

        rawResponse: data,
      };
    } catch (error) {
      throw new BadRequestException(
        'Không thể kết nối VNPAY để thực hiện refund',
      );
    }
  }

  private generateRequestId(): string {
    return `${Date.now()}${Math.floor(Math.random() * 1000)}`;
  }

  private formatVnpayDate(date: Date): string {
    const pad = (value: number) => value.toString().padStart(2, '0');

    return (
      date.getFullYear().toString() +
      pad(date.getMonth() + 1) +
      pad(date.getDate()) +
      pad(date.getHours()) +
      pad(date.getMinutes()) +
      pad(date.getSeconds())
    );
  }
}
