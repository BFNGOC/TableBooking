import { BookingStatus, DepositStatus, PaymentStatus } from '../types/booking.type';

export const BOOKING_STATUS_OPTIONS = [
    { id: BookingStatus.PENDING, text: 'Đang chờ' },
    { id: BookingStatus.CONFIRMED, text: 'Đã xác nhận' },
    { id: BookingStatus.REJECTED, text: 'Bị từ chối' },
    { id: BookingStatus.CANCELLED, text: 'Đã hủy' },
    { id: BookingStatus.CHECKED_IN, text: 'Đã đến' },
    { id: BookingStatus.COMPLETED, text: 'Hoàn thành' },
    { id: BookingStatus.NO_SHOW, text: 'Không đến' },
];

export const BOOKING_STATUS_UPCOMING_OPTIONS = [
    { id: BookingStatus.PENDING, text: 'Đang chờ' },
    { id: BookingStatus.CONFIRMED, text: 'Đã xác nhận' },
    { id: BookingStatus.REJECTED, text: 'Bị từ chối' },
    { id: BookingStatus.CANCELLED, text: 'Đã hủy' },
];

export const PAYMENT_STATUS_OPTIONS = [
    { id: PaymentStatus.UNPAID, text: 'Chưa thanh toán' },
    { id: PaymentStatus.PAID, text: 'Đã thanh toán' },
    { id: PaymentStatus.PARTIAL, text: 'Thanh toán đặt cọc' },
    { id: PaymentStatus.REFUNDED, text: 'Đã hoàn tiền' },
];

export const DEPOSIT_STATUS_OPTIONS = [
    { id: DepositStatus.NOT_REQUIRED, text: 'Không yêu cầu' },
    { id: DepositStatus.PENDING, text: 'Chờ thanh toán' },
    { id: DepositStatus.PAID, text: 'Đã thanh toán' },
    { id: DepositStatus.REFUNDED, text: 'Đã hoàn tiền' },
    { id: DepositStatus.FORFEITED, text: 'Bị mất cọc' },
];
