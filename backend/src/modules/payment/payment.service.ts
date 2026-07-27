import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import {
  Payment,
  PaymentDocument,
  PaymentTransactionStatus,
  PaymentType,
} from './schemas/payment.schema';

import {
  Booking,
  BookingDocument,
  BookingStatus,
  DepositStatus,
  PaymentStatus,
} from '../bookings/schemas/booking.schema';

import { CreatePaymentDto } from './dto/create-payment.dto';
import { RedisService } from '@app/shared/redis/redis.service';
import { getBookingHoldKey } from '@app/helpers/redis/booking-hold-key.util';
import { VnpayService } from './vnpay.service';
import { ConfigService } from '@nestjs/config';
import { ReturnQueryFromVNPay } from 'vnpay';

@Injectable()
export class PaymentService {
  constructor(
    @InjectModel(Payment.name)
    private readonly paymentModel: Model<PaymentDocument>,

    @InjectModel(Booking.name)
    private readonly bookingModel: Model<BookingDocument>,

    private readonly redisService: RedisService,
    private readonly vnpayService: VnpayService,
    private readonly configService: ConfigService,
  ) {}

  private async validateBookingRedisHold(booking: BookingDocument) {
    for (const tableId of booking.tableIds) {
      const key = getBookingHoldKey(
        booking.restaurantId.toString(),
        tableId.toString(),
        booking.bookingDate,
        booking.startTime,
        booking.endTime,
      );

      const exists = await this.redisService.exists(key);

      if (!exists) {
        throw new ConflictException(
          'Thời gian giữ bàn đã hết hạn, vui lòng đặt bàn lại hoặc liên hệ với nhà hàng để xử lý',
        );
      }
    }
  }

  async createPayment(userId: string, dto: CreatePaymentDto, ipAddress) {
    // =====================================================
    // 1. VALIDATE USER ID
    // =====================================================

    if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestException('Định dạng ID người dùng không hợp lệ');
    }

    // =====================================================
    // 2. VALIDATE BOOKING ID
    // =====================================================

    if (!Types.ObjectId.isValid(dto.bookingId)) {
      throw new BadRequestException('Định dạng ID booking không hợp lệ');
    }

    const userObjectId = new Types.ObjectId(userId);
    const bookingObjectId = new Types.ObjectId(dto.bookingId);

    // =====================================================
    // 3. FIND BOOKING
    // =====================================================

    const booking = await this.bookingModel.findById(bookingObjectId);

    if (!booking) {
      throw new NotFoundException('Không tìm thấy booking');
    }

    // =====================================================
    // 4. CHECK BOOKING OWNERSHIP
    // =====================================================

    if (booking.userId.toString() !== userObjectId.toString()) {
      throw new ForbiddenException('Bạn không có quyền thanh toán booking này');
    }

    // =====================================================
    // 5. CHECK BOOKING STATUS
    // =====================================================

    if (dto.type === PaymentType.DEPOSIT) {
      if (booking.status !== BookingStatus.PENDING) {
        throw new ConflictException(
          'Booking không còn ở trạng thái chờ thanh toán tiền cọc',
        );
      }
    }

    if (dto.type === PaymentType.FULL) {
      if (
        booking.paymentStatus !== PaymentStatus.PARTIAL &&
        booking.paymentStatus !== PaymentStatus.UNPAID
      ) {
        throw new ConflictException(
          'Booking không ở trạng thái có thể thanh toán toàn bộ',
        );
      }
    }

    // =====================================================
    // 5.1. CHECK REDIS HOLD
    // =====================================================
    // Chỉ booking có yêu cầu cọc mới có Redis hold.
    // Booking không yêu cầu cọc thì không cần check Redis hold.

    if (booking.depositStatus === DepositStatus.PENDING) {
      await this.validateBookingRedisHold(booking);
    }

    // =====================================================
    // 6. XÁC ĐỊNH SỐ TIỀN THANH TOÁN
    // =====================================================

    let amount: number;

    switch (dto.type) {
      // ===================================================
      // THANH TOÁN TIỀN CỌC
      // ===================================================

      case PaymentType.DEPOSIT: {
        // Booking không yêu cầu cọc
        if (booking.depositStatus === DepositStatus.NOT_REQUIRED) {
          throw new BadRequestException(
            'Booking này không yêu cầu thanh toán tiền cọc',
          );
        }

        // Cọc đã thanh toán
        if (booking.depositStatus === DepositStatus.PAID) {
          throw new ConflictException(
            'Tiền cọc của booking đã được thanh toán',
          );
        }

        // Chỉ cho phép thanh toán khi đang chờ cọc
        if (booking.depositStatus !== DepositStatus.PENDING) {
          throw new ConflictException(
            'Booking không ở trạng thái chờ thanh toán tiền cọc',
          );
        }

        // Kiểm tra thời gian hold
        if (!booking.holdExpiresAt || booking.holdExpiresAt <= new Date()) {
          throw new ConflictException(
            'Thời gian thanh toán tiền cọc đã hết hạn',
          );
        }

        // Kiểm tra payment status
        if (booking.paymentStatus !== PaymentStatus.UNPAID) {
          throw new ConflictException(
            'Booking không còn ở trạng thái chờ thanh toán',
          );
        }

        amount = booking.depositAmount ?? 0;

        break;
      }

      // ===================================================
      // THANH TOÁN TOÀN BỘ
      // ===================================================

      case PaymentType.FULL: {
        if (booking.paymentStatus === PaymentStatus.PAID) {
          throw new ConflictException('Booking đã được thanh toán đầy đủ');
        }

        const finalPrice = booking.pricingSnapshot?.finalPrice ?? 0;

        if (booking.paymentStatus === PaymentStatus.PARTIAL) {
          amount = Math.max(0, finalPrice - (booking.depositAmount ?? 0));
        } else {
          amount = finalPrice;
        }

        break;
      }

      default:
        throw new BadRequestException('Loại thanh toán không hợp lệ');
    }

    // =====================================================
    // 7. VALIDATE AMOUNT
    // =====================================================

    if (amount <= 0) {
      throw new BadRequestException('Số tiền thanh toán không hợp lệ');
    }

    // =====================================================
    // 8. CHECK EXISTING PENDING PAYMENT
    // =====================================================

    const existingPayment = await this.paymentModel.findOne({
      bookingId: booking._id,
      type: dto.type,
      status: PaymentTransactionStatus.PENDING,
    });

    if (existingPayment) {
      // ===============================================
      // Payment đã hết hạn
      // ===============================================

      if (
        existingPayment.expiresAt &&
        existingPayment.expiresAt <= new Date()
      ) {
        existingPayment.status = PaymentTransactionStatus.EXPIRED;

        await existingPayment.save();
      } else {
        // =============================================
        // Payment vẫn còn hiệu lực
        // Không tạo payment mới
        // =============================================

        return {
          paymentId: existingPayment._id,
          bookingId: booking._id,
          amount: existingPayment.amount,
          type: existingPayment.type,
          method: existingPayment.method,
          status: existingPayment.status,
          paymentUrl: existingPayment.paymentUrl,
          expiresAt: existingPayment.expiresAt,
        };
      }
    }

    // =====================================================
    // 9. CREATE ORDER CODE
    // =====================================================

    const orderCode = `TB-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    // =====================================================
    // 10. PAYMENT EXPIRATION
    // =====================================================

    // Nếu thanh toán cọc thì payment hết hạn theo Redis hold
    if (!booking.holdExpiresAt) {
      throw new ConflictException(
        'Booking không có thời gian thanh toán hợp lệ',
      );
    }

    if (booking.holdExpiresAt <= new Date()) {
      throw new ConflictException('Thời gian thanh toán booking đã hết hạn');
    }

    const expiresAt = booking.holdExpiresAt;

    // =====================================================
    // 11. CREATE PAYMENT RECORD
    // =====================================================

    const payment = await this.paymentModel.create({
      bookingId: booking._id,

      userId: booking.userId,

      restaurantId: booking.restaurantId,

      amount,

      type: dto.type,

      method: dto.method,

      status: PaymentTransactionStatus.PENDING,

      orderCode,

      expiresAt,
    });

    // =====================================================
    // 12. CREATE VNPAY PAYMENT URL
    // =====================================================

    let paymentUrl: string;

    try {
      paymentUrl = this.vnpayService.createPaymentUrl({
        orderCode,
        amount,
        orderInfo: `Thanh toán booking ${booking._id.toString()}`,
        ipAddr: ipAddress,
        returnUrl: `${this.configService.get<string>(
          'BACKEND_URL',
        )}/payment/vnpay/ipn`,
      });
    } catch (error) {
      payment.status = PaymentTransactionStatus.FAILED;

      await payment.save();

      throw new InternalServerErrorException(
        'Không thể tạo URL thanh toán VNPay',
      );
    }

    // =====================================================
    // 13. SAVE PAYMENT URL
    // =====================================================

    payment.paymentUrl = paymentUrl;

    await payment.save();

    // =====================================================
    // 14. RETURN PAYMENT
    // =====================================================

    return {
      paymentId: payment._id,
      bookingId: booking._id,
      amount: payment.amount,
      type: payment.type,
      method: payment.method,
      status: payment.status,
      paymentUrl: payment.paymentUrl,
      expiresAt: payment.expiresAt,
    };
  }

  async handleVnpayIpn(query: ReturnQueryFromVNPay) {
    // =====================================================
    // 1. VERIFY VNPAY SIGNATURE
    // =====================================================

    try {
      this.vnpayService.verifyIpn(query);
    } catch (error) {
      console.error('VNPay IPN verification failed:', error);

      return {
        RspCode: '97',
        Message: 'Invalid signature',
      };
    }

    // =====================================================
    // 2. GET ORDER CODE
    // =====================================================

    const orderCode = query.vnp_TxnRef;

    if (!orderCode) {
      return {
        RspCode: '01',
        Message: 'Order not found',
      };
    }

    // =====================================================
    // 3. FIND PAYMENT
    // =====================================================

    const payment = await this.paymentModel.findOne({
      orderCode,
    });

    if (!payment) {
      return {
        RspCode: '01',
        Message: 'Order not found',
      };
    }

    // =====================================================
    // 4. CHECK AMOUNT
    // =====================================================

    const vnpAmount = Number(query.vnp_Amount);

    // VNPay gửi amount * 100
    const expectedAmount = payment.amount * 100;

    if (vnpAmount !== expectedAmount) {
      return {
        RspCode: '04',
        Message: 'Invalid amount',
      };
    }

    // =====================================================
    // 5. CHECK PAYMENT ALREADY PROCESSED
    // =====================================================

    if (payment.status === PaymentTransactionStatus.PAID) {
      return {
        RspCode: '02',
        Message: 'Order already confirmed',
      };
    }

    // =====================================================
    // 6. PAYMENT SUCCESS
    // =====================================================

    if (
      query.vnp_ResponseCode === '00' &&
      query.vnp_TransactionStatus === '00'
    ) {
      payment.status = PaymentTransactionStatus.PAID;

      payment.transactionId = query.vnp_TransactionNo?.toString();

      payment.providerData = query;

      await payment.save();

      // Cập nhật Booking
      await this.handleSuccessfulPayment(payment);
    } else {
      // ===================================================
      // 7. PAYMENT FAILED
      // ===================================================

      payment.status = PaymentTransactionStatus.FAILED;

      payment.transactionId = query.vnp_TransactionNo?.toString();

      payment.providerData = query;

      await payment.save();
    }

    // =====================================================
    // 8. RESPONSE TO VNPAY
    // =====================================================

    return {
      status: 'SUCCESS',
      message: 'Thanh toán tiền cọc thành công',
      paymentId: payment._id.toString(),
    };
  }

  private async handleSuccessfulPayment(payment: PaymentDocument) {
    const booking = await this.bookingModel.findById(payment.bookingId);

    if (!booking) {
      throw new NotFoundException('Không tìm thấy booking của payment');
    }

    // =====================================================
    // 1. THANH TOÁN TIỀN CỌC
    // =====================================================

    if (payment.type === PaymentType.DEPOSIT) {
      // Cập nhật trạng thái cọc
      booking.depositStatus = DepositStatus.PAID;

      // Chỉ mới thanh toán một phần
      booking.paymentStatus = PaymentStatus.PARTIAL;

      // Thanh toán cọc thành công
      // => Booking được xác nhận
      booking.status = BookingStatus.CONFIRMED;

      booking.confirmedAt = new Date();

      await booking.save();

      return;
    }

    // =====================================================
    // 2. THANH TOÁN TOÀN BỘ
    // =====================================================

    if (payment.type === PaymentType.FULL) {
      // Nếu booking trước đó đang yêu cầu cọc
      // thì coi như phần cọc cũng đã được thanh toán
      if (booking.depositStatus === DepositStatus.PENDING) {
        booking.depositStatus = DepositStatus.PAID;
      }

      // Thanh toán toàn bộ
      booking.paymentStatus = PaymentStatus.PAID;

      // Xác nhận booking
      booking.status = BookingStatus.CONFIRMED;

      booking.confirmedAt = new Date();

      await booking.save();

      return;
    }
  }
}
