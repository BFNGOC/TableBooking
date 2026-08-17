'use client';

import { Button, Drawer } from '@heroui/react';
import { BookingStatus, IBooking } from '../../types/booking.type';
import {
    translateBookingStatus,
    translatePaymentStatus,
    translateDepositStatus,
} from '../../utils/booking-status';
import { useBookingDetail } from '../../hook/useBooking';

interface BookingSessionDrawerProps {
    session: IBooking | null;
    open: boolean;
    onClose: () => void;
}

const getStatusColor = (status?: BookingStatus) => {
    switch (status) {
        case BookingStatus.CONFIRMED:
            return '#22c55e';
        case BookingStatus.PENDING:
            return '#f59e0b';
        case BookingStatus.REJECTED:
            return '#ef4444';
        case BookingStatus.CANCELLED:
            return '#6b7280';
        default:
            return '#3b82f6';
    }
};

export default function BookingSessionDrawer({
    session,
    open,
    onClose,
}: BookingSessionDrawerProps) {
    const { data: bookingDetail } = useBookingDetail(session?._id);

    const detail = bookingDetail ?? session;

    const renderTableDetails = () => {
        if (!detail?.tableIds || detail.tableIds.length === 0) {
            return <span className="font-semibold text-gray-800">—</span>;
        }

        if (typeof detail.tableIds[0] === 'string') {
            return (
                <span className="font-semibold text-gray-800">{detail.tableIds.length} bàn</span>
            );
        }

        return (
            <div className="space-y-2">
                {detail.tableIds.map((table: any) => (
                    <div key={table._id} className="rounded-xl border border-gray-200 bg-white p-3">
                        <div className="flex items-center justify-between gap-3 text-sm">
                            <span className="font-semibold text-gray-800">
                                Bàn {table.tableNumber}
                            </span>
                            <span className="text-gray-500">{table.capacity} người</span>
                        </div>
                        <div className="mt-1 text-sm text-gray-600">
                            Khu vực:{' '}
                            {typeof table.areaId === 'string' ? '—' : (table.areaId?.name ?? '—')}
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    console.log('Rendering BookingSessionDrawer with session:', session, 'detail:', bookingDetail);

    return (
        <Drawer isOpen={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
            <Drawer.Backdrop>
                <Drawer.Content placement="right">
                    <Drawer.Dialog className="h-full bg-white shadow-xl flex flex-col w-100">
                        <Drawer.Header className="border-b border-gray-100 p-5 flex flex-col gap-2">
                            <div className="flex items-center justify-between w-full">
                                <Drawer.Heading className="text-xl font-bold text-gray-800">
                                    Chi Tiết Đặt Bàn
                                </Drawer.Heading>
                                <span
                                    className="px-3 py-1 rounded-full text-xs font-semibold text-white shadow-sm"
                                    style={{
                                        backgroundColor: getStatusColor(detail?.status),
                                    }}
                                >
                                    {translateBookingStatus(detail?.status)}
                                </span>
                            </div>
                            <p className="text-xs text-gray-400">
                                Mã: <span className="font-mono text-gray-600">{detail?._id}</span>
                            </p>
                        </Drawer.Header>

                        <Drawer.Body className="flex-1 overflow-y-auto p-5 space-y-6">
                            <div className="space-y-3">
                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                                    Thông tin khách hàng
                                </h4>
                                <div className="bg-gray-50 rounded-xl p-4 space-y-2.5">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-500">Tên người đặt:</span>
                                        <span className="font-semibold text-gray-800">
                                            {detail?.contactName}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-500">Số điện thoại:</span>
                                        <a
                                            href={`tel:${detail?.contactPhone}`}
                                            className="font-medium text-blue-600 hover:underline flex items-center gap-1"
                                        >
                                            {detail?.contactPhone}
                                        </a>
                                    </div>
                                    <div className="text-sm">
                                        <span className="text-gray-500">Ghi chú khách hàng:</span>
                                        <div className="mt-2 rounded-xl border border-gray-200 bg-white p-3 text-sm text-gray-700 whitespace-pre-wrap break-words">
                                            {detail?.restaurantNote ? detail.restaurantNote : '—'}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                                    Chi tiết dịch vụ
                                </h4>
                                <div className="bg-gray-50 rounded-xl p-4 space-y-2.5">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-500">Ngày đến:</span>
                                        <span className="font-medium text-gray-800">
                                            {detail?.bookingDate
                                                ? new Date(detail.bookingDate).toLocaleDateString(
                                                      'vi-VN'
                                                  )
                                                : '—'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-500">Thời gian:</span>
                                        <span className="font-semibold bg-amber-50 text-amber-700 px-2 py-0.5 rounded text-xs">
                                            {detail?.startTime ?? '—'} - {detail?.endTime ?? '—'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-500">Số lượng khách:</span>
                                        <span className="font-bold text-gray-800 text-base">
                                            {detail?.guestCount ?? '—'} người
                                        </span>
                                    </div>
                                    <div className="space-y-2 text-sm">
                                        <span className="text-gray-500">Danh sách bàn:</span>
                                        <div className="mt-2">{renderTableDetails()}</div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                                    Thanh toán & Đặt cọc
                                </h4>
                                <div className="bg-gray-50 rounded-xl p-4 space-y-2.5">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-500">Tiền đặt cọc:</span>
                                        <div className="text-right">
                                            <span className="font-medium text-gray-800">
                                                {detail?.depositAmount?.toLocaleString('vi-VN')} đ
                                            </span>
                                            <span
                                                className={`block text-[10px] font-medium ${
                                                    detail?.depositStatus === 'PAID'
                                                        ? 'text-green-600'
                                                        : 'text-amber-500'
                                                }`}
                                            >
                                                ({translateDepositStatus(detail?.depositStatus)})
                                            </span>
                                        </div>
                                    </div>
                                    <div className="border-t border-gray-200/60 my-1" />
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-500">Tổng giá trị dự kiến:</span>
                                        <span className="font-bold text-lg text-emerald-600">
                                            {detail?.pricingSnapshot?.finalPrice?.toLocaleString(
                                                'vi-VN'
                                            )}{' '}
                                            đ
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="text-gray-500">
                                            Trạng thái đơn hóa đơn:
                                        </span>
                                        <span
                                            className={`font-medium ${
                                                detail?.paymentStatus === 'PAID'
                                                    ? 'text-green-600'
                                                    : 'text-gray-500'
                                            }`}
                                        >
                                            {translatePaymentStatus(detail?.paymentStatus)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </Drawer.Body>

                        <Drawer.Footer className="border-t border-gray-100 p-4 flex gap-2 bg-gray-50">
                            <Button className="flex-1" variant="secondary" onClick={onClose}>
                                Đóng lại
                            </Button>
                            <Button
                                className="flex-1 font-semibold"
                                variant="danger"
                                onClick={() => console.log('Duyệt booking:', detail?._id)}
                            >
                                Từ chối bàn
                            </Button>
                        </Drawer.Footer>
                    </Drawer.Dialog>
                </Drawer.Content>
            </Drawer.Backdrop>
        </Drawer>
    );
}
