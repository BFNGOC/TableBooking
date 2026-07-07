'use client';

import { ReactNode } from 'react';
import { Button } from '@heroui/react';
import ModalCustom from './ModalCustom';

interface ConfirmModalProps {
    isOpen: boolean;
    title?: string;
    description?: string | ReactNode;
    onClose: () => void;
    onConfirm: () => void;
    isLoading?: boolean;
}

function ConfirmModal({
    isOpen,
    title = 'Xác nhận',
    description = 'Bạn có chắc chắn muốn thực hiện hành động này?',
    onClose,
    onConfirm,
    isLoading,
}: ConfirmModalProps) {
    return (
        <ModalCustom
            open={isOpen}
            onOpenChange={onClose}
            title={title}
            footer={
                <>
                    {' '}
                    <Button variant="secondary" onPress={onClose}>
                        Hủy
                    </Button>
                    <Button variant="danger" isPending={isLoading} onPress={onConfirm}>
                        Xác nhận
                    </Button>
                </>
            }
        >
            {description}
        </ModalCustom>
    );
}

export default ConfirmModal;
