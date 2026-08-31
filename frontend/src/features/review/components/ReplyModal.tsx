'use client';

import { useEffect, useState } from 'react';
import { Button, Spinner } from '@heroui/react';
import ModalCustom from '@/shared/components/modals/ModalCustom';

interface ReplyModalProps {
    isOpen: boolean;
    reviewId: string;
    /** Nội dung reply hiện tại (nếu đang sửa) */
    currentContent?: string;
    onSubmit: (reviewId: string, content: string) => void;
    onClose: () => void;
    isPending?: boolean;
}

export default function ReplyModal({
    isOpen,
    reviewId,
    currentContent,
    onSubmit,
    onClose,
    isPending,
}: ReplyModalProps) {
    const [content, setContent] = useState('');

    // Reset / pre-fill khi modal mở
    useEffect(() => {
        if (isOpen) {
            setContent(currentContent ?? '');
        }
    }, [isOpen, currentContent]);

    const handleSubmit = () => {
        if (!content.trim()) return;
        onSubmit(reviewId, content.trim());
    };

    const remaining = 500 - content.length;

    return (
        <ModalCustom
            open={isOpen}
            onOpenChange={(open) => { if (!open) onClose(); }}
            title={currentContent ? 'Sửa phản hồi' : 'Phản hồi đánh giá'}
        >
            {isPending ? (
                <div className="flex h-40 items-center justify-center">
                    <Spinner />
                </div>
            ) : (
                <div className="flex flex-col gap-4 py-2">
                    <p className="text-sm text-[#6e5a4f]">
                        Phản hồi của bạn sẽ hiển thị công khai dưới đánh giá này.
                    </p>

                    <div className="flex flex-col gap-1">
                        <textarea
                            value={content}
                            onChange={(e) => {
                                if (e.target.value.length <= 500) {
                                    setContent(e.target.value);
                                }
                            }}
                            rows={5}
                            placeholder="Nhập phản hồi của nhà hàng..."
                            className="w-full rounded-xl border border-[#e6d8c9] bg-[#fdf8f5] px-4 py-3 text-sm text-[#3d2a21] placeholder-[#b0a09a] outline-none focus:border-[#6f4e37] focus:ring-2 focus:ring-[#6f4e37]/20 resize-none transition"
                        />
                        <p
                            className={`text-right text-xs ${
                                remaining < 50 ? 'text-orange-500' : 'text-[#a89080]'
                            }`}
                        >
                            {remaining} ký tự còn lại
                        </p>
                    </div>

                    <div className="flex justify-end gap-3">
                        <Button variant="outline" onPress={onClose}>
                            Hủy
                        </Button>
                        <Button
                            variant="danger-soft"
                            onPress={handleSubmit}
                            isDisabled={!content.trim() || isPending}
                            isPending={isPending}
                        >
                            Gửi phản hồi
                        </Button>
                    </div>
                </div>
            )}
        </ModalCustom>
    );
}
