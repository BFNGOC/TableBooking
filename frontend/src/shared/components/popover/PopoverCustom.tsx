'use client';

import { Popover } from '@heroui/react';

interface PopoverCustomProps {
    open: boolean;
    onClose: () => void;
    heading: React.ReactNode;
    children: React.ReactNode;
}

function PopoverCustom({ open, onClose, heading, children }: PopoverCustomProps) {
    return (
        <div className="flex items-center gap-4">
            <Popover isOpen={open} onOpenChange={onClose}>
                <Popover.Content className="max-w-64">
                    <Popover.Dialog>
                        <Popover.Heading>{heading}</Popover.Heading>
                        {children}
                    </Popover.Dialog>
                </Popover.Content>
            </Popover>
        </div>
    );
}

export default PopoverCustom;
