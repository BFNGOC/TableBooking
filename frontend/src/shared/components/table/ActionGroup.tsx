'use client';

import { ReactNode, useState } from 'react';
import { Button, ButtonProps } from '@heroui/react';
import TooltipCustom from '../tooltip/TooltipCustom';
import ConfirmModal from '../modals/ConfirmModal';

export interface TableAction<T> {
    show?: (record: T) => boolean;

    icon: ReactNode;

    tooltip?: string;

    className?: string;

    variant?: ButtonProps['variant'];

    isDisabled?: boolean;

    isPending?: boolean;

    confirm?: {
        title?: string;
        description?: string | ReactNode | ((record: T) => ReactNode);
        isLoading?: boolean;
    };

    onPress: (record: T) => void;
}

interface ActionGroupProps<T> {
    record: T;

    actions: TableAction<T>[];
}

function ActionGroup<T>({ record, actions }: ActionGroupProps<T>) {
    const [confirmState, setConfirmState] = useState<{
        open: boolean;
        action?: TableAction<T>;
        isSubmitting: boolean;
    }>({
        open: false,
        isSubmitting: false,
    });

    const handleActionPress = (action: TableAction<T>) => {
        if (action.confirm) {
            setConfirmState({ open: true, action, isSubmitting: false });
            return;
        }

        action.onPress(record);
    };

    const closeConfirm = () => {
        setConfirmState({ open: false, action: undefined, isSubmitting: false });
    };

    const handleConfirm = () => {
        if (!confirmState.action) return;

        setConfirmState({ open: false, action: confirmState.action, isSubmitting: true });
        confirmState.action.onPress(record);
    };

    return (
        <div className="flex items-center gap-1">
            {actions
                .filter((action) => action.show?.(record) ?? true)
                .map((action, index) => {
                    const button = (
                        <Button
                            isIconOnly
                            size="sm"
                            variant={action.variant ?? 'outline'}
                            isDisabled={action.isDisabled || action.isPending}
                            isPending={action.isPending}
                            onPress={() => handleActionPress(action)}
                            className={action.className}
                        >
                            {action.icon}
                        </Button>
                    );

                    return action.tooltip ? (
                        <TooltipCustom key={index} tooltip={action.tooltip}>
                            {button}
                        </TooltipCustom>
                    ) : (
                        <span key={index}>{button}</span>
                    );
                })}

            {confirmState.action && (
                <ConfirmModal
                    isOpen={confirmState.open}
                    title={confirmState.action.confirm?.title ?? 'Xác nhận'}
                    description={
                        typeof confirmState.action.confirm?.description === 'function'
                            ? confirmState.action.confirm.description(record)
                            : (confirmState.action.confirm?.description ??
                              'Bạn có chắc chắn muốn thực hiện hành động này?')
                    }
                    onClose={closeConfirm}
                    onConfirm={handleConfirm}
                    isLoading={confirmState.isSubmitting || confirmState.action.confirm?.isLoading}
                />
            )}
        </div>
    );
}

export default ActionGroup;
