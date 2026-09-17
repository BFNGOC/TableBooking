'use client';

import { Button } from '@heroui/react';
import { CheckCircle2, XCircle } from 'lucide-react';
import ModalCustom from '@/shared/components/modals/ModalCustom';
import { TaxVerificationResponse } from '../types/restaurant-admin-response-type';

interface TaxVerificationModalProps {
    open: boolean;
    onClose: () => void;
    data?: TaxVerificationResponse;
    error?: string;
    isPending: boolean;
}

function TaxVerificationModal({
    open,
    onClose,
    data,
    isPending,
    error,
}: TaxVerificationModalProps) {
    return (
        <ModalCustom
            open={open}
            onOpenChange={(open) => {
                if (!open) {
                    onClose();
                }
            }}
            title="Kiểm tra mã số thuế"
            size="lg"
            dialogClassName="!w-[700px]"
            isDismissable={!isPending}
            footer={
                <Button variant="secondary" onPress={onClose} isDisabled={isPending}>
                    Đóng
                </Button>
            }
        >
            {isPending ? (
                <div className="flex flex-col items-center justify-center py-12 gap-4">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-default-200 border-t-primary" />

                    <p className="text-default-500">Đang kiểm tra mã số thuế...</p>
                </div>
            ) : data ? (
                <div className="space-y-6">
                    {/* Kết quả xác minh */}
                    <div
                        className={`rounded-lg border p-4 ${
                            data.isValid
                                ? 'border-success-200 bg-success-50'
                                : 'border-danger-200 bg-danger-50'
                        }`}
                    >
                        <div className="flex items-center gap-3">
                            {data.isValid ? (
                                <CheckCircle2 size={24} className="text-success" />
                            ) : (
                                <XCircle size={24} className="text-danger" />
                            )}

                            <div>
                                <p className="font-semibold">
                                    {data.isValid ? 'Mã số thuế hợp lệ' : 'Mã số thuế không hợp lệ'}
                                </p>

                                <p className="text-sm text-default-500">
                                    {data.isValid
                                        ? 'Mã số thuế tồn tại và doanh nghiệp đang hoạt động.'
                                        : 'Không thể xác minh mã số thuế.'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Kết quả kiểm tra */}
                    <section className="space-y-3">
                        <h3 className="font-semibold">Kết quả xác minh</h3>

                        <div className="grid grid-cols-2 gap-3">
                            <VerificationItem
                                label="Mã số thuế khớp"
                                isValid={data.isTaxCodeMatched}
                            />

                            <VerificationItem
                                label="Doanh nghiệp đang hoạt động"
                                isValid={data.isActive}
                            />
                        </div>
                    </section>

                    {/* Thông tin nhà hàng */}
                    <section className="space-y-3">
                        <h3 className="font-semibold">Thông tin đăng ký</h3>

                        <div className="rounded-lg border p-4 space-y-3">
                            <InfoRow label="Tên nhà hàng" value={data.restaurant.restaurantName} />

                            <InfoRow label="Mã số thuế" value={data.restaurant.taxCode} />

                            <InfoRow label="Địa chỉ" value={data.restaurant.address} />
                        </div>
                    </section>

                    {/* Thông tin doanh nghiệp */}
                    <section className="space-y-3">
                        <h3 className="font-semibold">Thông tin doanh nghiệp</h3>

                        <div className="rounded-lg border p-4 space-y-3">
                            <InfoRow label="Tên doanh nghiệp" value={data.company.nameVi} />

                            <InfoRow label="Mã số thuế" value={data.company.mst} />

                            <InfoRow label="Trạng thái" value={data.company.status} />

                            <InfoRow label="Người đại diện" value={data.company.legalRepName} />

                            <InfoRow label="Địa chỉ" value={data.company.addressFull} />

                            <InfoRow label="Tỉnh / Thành phố" value={data.company.province} />

                            <InfoRow label="Quận / Huyện" value={data.company.district} />

                            <InfoRow label="Ngành nghề" value={data.company.industry} />
                        </div>
                    </section>
                </div>
            ) : (
                <div className="py-12 text-center text-default-500">{error}</div>
            )}
        </ModalCustom>
    );
}

interface VerificationItemProps {
    label: string;
    isValid: boolean;
}

function VerificationItem({ label, isValid }: VerificationItemProps) {
    return (
        <div className="flex items-center gap-2 rounded-lg border p-3">
            {isValid ? (
                <CheckCircle2 size={18} className="text-success" />
            ) : (
                <XCircle size={18} className="text-danger" />
            )}

            <span className="text-sm">{label}</span>
        </div>
    );
}

interface InfoRowProps {
    label: string;
    value?: string | null;
}

function InfoRow({ label, value }: InfoRowProps) {
    return (
        <div className="grid grid-cols-[150px_1fr] gap-4 text-sm">
            <span className="text-default-500">{label}</span>

            <span className="font-medium break-words">{value || '—'}</span>
        </div>
    );
}

export default TaxVerificationModal;
