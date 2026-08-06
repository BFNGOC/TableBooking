'use client';

import { ReactNode } from 'react';
import { Drawer } from '@heroui/react';

interface DrawerCustomProps {
    isOpen: boolean;
    onClose: () => void;
    title?: ReactNode;
    children?: ReactNode;
    footer?: ReactNode;
    placement?: 'right' | 'left' | 'top' | 'bottom';
    dialogClassName?: string;
}

export function DrawerCustom({
    isOpen,
    onClose,
    title,
    children,
    footer,
    placement = 'right',
    dialogClassName,
}: DrawerCustomProps) {
    return (
        <Drawer isOpen={isOpen} onOpenChange={(open) => !open && onClose()}>
            <Drawer.Backdrop>
                <Drawer.Content placement={placement}>
                    <Drawer.Dialog className={dialogClassName}>
                        <Drawer.Header>
                            <Drawer.Heading>{title}</Drawer.Heading>
                        </Drawer.Header>

                        <Drawer.Body>{children}</Drawer.Body>

                        {footer && <Drawer.Footer>{footer}</Drawer.Footer>}
                    </Drawer.Dialog>
                </Drawer.Content>
            </Drawer.Backdrop>
        </Drawer>
    );
}

export default DrawerCustom;