'use client';

import { Modal } from '@heroui/react';
import type { ReactNode } from 'react';

interface IModalCustomProps {
    open: boolean;

    onOpenChange: (open: boolean) => void;

    title: string;

    children: ReactNode;

    footer?: ReactNode;

    icon?: ReactNode;

    size?: 'xs' | 'sm' | 'md' | 'lg' | 'cover' | 'full';

    isDismissable?: boolean;

    dialogClassName?: string;
}

function ModalCustom({
    open,
    onOpenChange,
    title,
    children,
    footer,
    icon,
    size = 'md',
    isDismissable,
    dialogClassName,
}: IModalCustomProps) {
    return (
        <Modal isOpen={open} onOpenChange={onOpenChange}>
            <Modal.Backdrop isDismissable={isDismissable}>
                <Modal.Container className="!w-fit !max-w-[90vw] !min-w-[550px] mx-auto">
                    <Modal.Dialog className={`${dialogClassName} !w-fit !max-w-none`}>
                        <Modal.CloseTrigger />
                        <Modal.Header>
                            {icon && (
                                <Modal.Icon className="bg-default text-foreground text-lg">
                                    {icon}
                                </Modal.Icon>
                            )}
                            <Modal.Heading className="text-lg">{title}</Modal.Heading>
                        </Modal.Header>
                        <Modal.Body>{children}</Modal.Body>
                        {footer && <Modal.Footer>{footer}</Modal.Footer>}
                    </Modal.Dialog>
                </Modal.Container>
            </Modal.Backdrop>
        </Modal>
    );
}

export default ModalCustom;
