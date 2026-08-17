'use client';

import { useState } from 'react';
import { QrCode, UserRoundSearch } from 'lucide-react';
import PageHeader from '@/shared/components/layouts/PageHeader';
import { Button, Input, Spinner } from '@heroui/react';
import { useCheckInBooking, useVerifyCheckIn } from '../../hook/useCheckIn';
import { IBooking } from '../../types/booking.type';
import { translateBookingStatus, translatePaymentStatus } from '../../utils/booking-status';
import { useBookingDetail } from '../../hook/useBooking';

function CheckInPage() {
    const [checkInCode, setCheckInCode] = useState('');

    const {
        mutate: verifyCheckIn,
        data: verifyData,
        isPending: isVerifyingCheckIn,
        isError: isVerifyError,
    } = useVerifyCheckIn();

    const { mutateAsync: checkInBooking, isPending: isCheckedIn } = useCheckInBooking();

    const { data: bookingDetail } = useBookingDetail(verifyData?.data._id);

    const booking = bookingDetail as IBooking | undefined;

    const handleVerify = () => {
        const code = checkInCode.trim();

        if (!code) return;

        verifyCheckIn({
            checkInCode: code,
        });
    };

    const handleCheckIn = async () => {
        if (!booking?._id) return;

        const result = await checkInBooking(booking._id);

        if (result?.data?.status === 'CHECKED_IN') {
            setCheckInCode('');
        }
    };

    return (
        <div className="flex h-full flex-col gap-6">
            <PageHeader
                title="Check-in khách hàng"
                subtitle="Quét mã QR hoặc nhập mã đặt bàn để làm thủ tục check-in cho khách."
            />

            <div className="grid min-h-0 flex-1 gap-6 lg:grid-cols-[275px_minmax(0,1fr)]">
                <div className="flex flex-col gap-6">
                    <div className="rounded-xl border border-[#e5ddd8] bg-white p-6">
                        <h2 className="mb-5 text-center text-[17px] font-semibold text-[#171717]">
                            Quét mã QR
                        </h2>

                        <div className="relative mx-auto aspect-square w-full max-w-[215px] overflow-hidden rounded-[34px] border border-dashed border-[#8f8178] bg-[#eee6e1]">
                            <div className="absolute left-0 right-0 top-[57px] h-[2px] bg-[#8d7b70]" />

                            <div className="absolute inset-0 flex items-center justify-center">
                                <QrCode size={27} strokeWidth={1.5} className="text-[#b9b0aa]" />
                            </div>

                            <div className="absolute left-3 top-3 h-5 w-5 border-l-[3px] border-t-[3px] border-[#5d4b40]" />

                            <div className="absolute right-3 top-3 h-5 w-5 border-r-[3px] border-t-[3px] border-[#5d4b40]" />

                            <div className="absolute bottom-3 left-3 h-5 w-5 border-b-[3px] border-l-[3px] border-[#5d4b40]" />

                            <div className="absolute bottom-3 right-3 h-5 w-5 border-b-[3px] border-r-[3px] border-[#5d4b40]" />
                        </div>

                        <p className="mt-4 text-center text-[12px] leading-5 text-[#6f625b]">
                            Đặt mã QR vào trong khung để hệ thống
                            <br />
                            tự động quét.
                        </p>
                    </div>

                    <div className="rounded-xl border border-[#e5ddd8] bg-white p-6">
                        <h2 className="text-[17px] font-semibold text-[#171717]">
                            Nhập mã thủ công
                        </h2>

                        <p className="mt-3 text-[12px] text-[#786d66]">
                            Nhập mã đặt bàn do khách cung cấp.
                        </p>

                        <div className="mt-4 flex flex-col items-center gap-3">
                            <Input
                                value={checkInCode}
                                onChange={(event) => setCheckInCode(event.target.value)}
                                placeholder="Nhập mã đặt bàn"
                                variant="primary"
                                onKeyDown={(event) => {
                                    if (event.key === 'Enter') {
                                        handleVerify();
                                    }
                                }}
                            />

                            <Button
                                size="sm"
                                isDisabled={!checkInCode.trim() || isVerifyingCheckIn}
                                isPending={isVerifyingCheckIn}
                                onPress={handleVerify}
                                className="min-w-[101px] bg-[#e8e5c9] px-4 text-[12px] font-medium text-[#5f5a3e]"
                            >
                                Tìm kiếm
                            </Button>
                        </div>
                    </div>
                </div>

                {isVerifyingCheckIn ? (
                    <div className="flex h-full min-h-[500px] flex-col items-center justify-center">
                        <Spinner size="lg" />

                        <p className="mt-5 text-[16px] font-medium text-[#4c4039]">
                            Đang kiểm tra thông tin khách
                        </p>

                        <p className="mt-2 text-[12px] text-[#8c7c72]">
                            Vui lòng chờ trong giây lát...
                        </p>
                    </div>
                ) : booking ? (
                    <div className="h-full p-6">
                        <div className="rounded-2xl border border-[#e8ddd7] bg-white p-6 shadow-sm">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-xs uppercase tracking-[0.2em] text-[#9a8b82]">
                                        Thông tin booking
                                    </p>

                                    <h2 className="mt-2 text-xl font-semibold text-[#211b18]">
                                        {booking.contactName ?? 'Khách hàng'}
                                    </h2>
                                </div>

                                <span className="rounded-full bg-[#e8f3e9] px-3 py-1 text-xs font-medium">
                                    {translateBookingStatus(booking.status)}
                                </span>
                            </div>

                            <div className="mt-6 grid gap-3 sm:grid-cols-2">
                                <InfoItem
                                    label="Số điện thoại"
                                    value={booking.contactPhone ?? '—'}
                                />

                                <InfoItem
                                    label="Số lượng khách"
                                    value={`${booking.guestCount ?? 0} người`}
                                />

                                <InfoItem
                                    label="Ngày đặt"
                                    value={
                                        booking.bookingDate
                                            ? new Date(booking.bookingDate).toLocaleDateString(
                                                  'vi-VN'
                                              )
                                            : '—'
                                    }
                                />
                                <InfoItem
                                    label="Thời gian"
                                    value={`${booking.startTime ?? '—'} - ${booking.endTime ?? '—'}`}
                                />

                                <InfoItem label="Mã check-in" value={booking.checkInCode ?? '—'} />

                                <InfoItem
                                    label="Trạng thái thanh toán"
                                    value={translatePaymentStatus(booking.paymentStatus)}
                                />

                                <InfoItem
                                    label="Số tiền cọc"
                                    value={booking.depositAmount?.toLocaleString('vi-VN') ?? '—'}
                                />

                                <InfoItem
                                    label="Tổng tiền bàn"
                                    value={
                                        booking.pricingSnapshot?.finalPrice?.toLocaleString(
                                            'vi-VN'
                                        ) ?? '—'
                                    }
                                />
                            </div>

                            <div className="mt-6 rounded-xl bg-[#faf5f1] p-4">
                                <p className="text-xs text-[#8b7c73]">Ghi chú khách hàng</p>

                                <p className="mt-2 text-sm text-[#4b403a]">
                                    {booking.restaurantNote || 'Không có ghi chú'}
                                </p>
                            </div>

                            {booking.status === 'CONFIRMED' && (
                                <div className="mt-6 flex justify-end gap-3">
                                    <Button
                                        isDisabled={!booking?._id}
                                        isPending={isCheckedIn}
                                        onPress={handleCheckIn}
                                        className="bg-[#6f4e37] px-6 text-white"
                                    >
                                        Xác nhận check-in
                                    </Button>
                                </div>
                            )}

                            <div></div>
                        </div>
                    </div>
                ) : (
                    <div className="rounded-2xl border border-[#e8ddd7] bg-[#fbf2ee] p-6 shadow-sm">
                        <div className="flex h-full min-h-[500px] flex-col items-center justify-center px-6 text-center">
                            <div className="mb-5 flex h-14 w-14 items-center justify-center">
                                <UserRoundSearch
                                    size={42}
                                    strokeWidth={1.5}
                                    className="text-[#d1c2ba]"
                                />
                            </div>

                            <h2 className="text-[17px] font-medium text-[#4c4039]">
                                {isVerifyError
                                    ? 'Không tìm thấy thông tin khách'
                                    : 'Đang chờ thông tin khách'}
                            </h2>

                            <p className="mt-2 max-w-[300px] text-[12px] leading-5 text-[#8c7c72]">
                                {isVerifyError
                                    ? 'Mã QR hoặc mã đặt bàn không hợp lệ. Vui lòng kiểm tra và thử lại.'
                                    : 'Quét QR hoặc nhập mã để hiển thị chi tiết đặt bàn.'}
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

interface InfoItemProps {
    label: string;
    value: string;
}

function InfoItem({ label, value }: InfoItemProps) {
    return (
        <div className="rounded-xl border border-[#eee5df] bg-white p-4">
            <p className="text-xs text-[#9a8b82]">{label}</p>
            <p className="mt-1 text-sm font-medium text-[#342b27]">{value}</p>
        </div>
    );
}

export default CheckInPage;
