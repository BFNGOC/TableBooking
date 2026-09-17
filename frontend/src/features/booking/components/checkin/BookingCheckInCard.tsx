'use client';

import { QRCodeSVG } from 'qrcode.react';

interface BookingCheckInCardProps {
    checkInToken?: string;
    checkInCode?: string;
}

export default function BookingCheckInCard({ checkInToken, checkInCode }: BookingCheckInCardProps) {
    if (!checkInToken) return null;

    return (
        <div className="overflow-hidden rounded-3xl border border-[#f1e6dd] bg-[#faf4ef] p-6 text-center">
            <div className="mx-auto mb-4 flex h-52 w-52 items-center justify-center rounded-3xl bg-white p-4 shadow-sm">
                <QRCodeSVG value={checkInToken} size={220} level="M" includeMargin />
            </div>

            <p className="text-sm font-medium text-[#1f2937]">Mã check-in</p>

            <p className="mt-2 text-lg font-semibold tracking-wider text-[#1f2937]">
                {checkInCode}
            </p>

            <p className="mt-2 text-xs text-[#857468]">Xuất trình mã QR này khi đến nhà hàng</p>
        </div>
    );
}
