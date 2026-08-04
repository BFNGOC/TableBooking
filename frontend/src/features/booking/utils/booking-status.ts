export const translateBookingStatus = (status: string | undefined) => {
    switch (status) {
        case 'PENDING':
            return 'Đang chờ';
        case 'REJECTED':
            return 'Bị từ chối';
        case 'CONFIRMED':
            return 'Đã xác nhận';
        case 'CANCELLED':
            return 'Đã hủy';
        case 'CHECKED_IN':
            return 'Đã đến';
        case 'COMPLETED':
            return 'Đã hoàn thành';
        case 'NO_SHOW':
            return 'Không đến';
        default:
            return status ?? '—';
    }
};

export const translatePaymentStatus = (status: string | undefined) => {
    switch (status) {
        case 'UNPAID':
            return 'Chưa thanh toán';
        case 'PAID':
            return 'Đã thanh toán';
        case 'PARTIAL':
            return 'Thanh toán đặt cọc';
        case 'REFUNDED':
            return 'Đã hoàn tiền';
        case 'PENDING':
            return 'Đang chờ';
        case 'FAILED':
            return 'Thanh toán thất bại';
        case 'CANCELLED':
            return 'Đã hủy';
        case 'EXPIRED':
            return 'Đã hết hạn';
        default:
            return status ?? '—';
    }
};

export const translatePaymentType = (type: string | undefined) => {
    switch (type) {
        case 'DEPOSIT':
            return 'Đặt cọc';
        case 'FULL':
            return 'Thanh toán đầy đủ';
        default:
            return type ?? '—';
    }
};

export function getBookingStatusText(status?: string) {
    switch (status) {
        case 'PENDING':
            return 'Đang chờ thanh toán';
        case 'CONFIRMED':
            return 'Đã xác nhận';
        case 'COMPLETED':
            return 'Hoàn thành';
        case 'CANCELLED':
            return 'Đã hủy';
        case 'NO_SHOW':
            return 'Không đến';
        case 'CHECKED_IN':
            return 'Đã check-in';
        default:
            return status ?? '';
    }
}
