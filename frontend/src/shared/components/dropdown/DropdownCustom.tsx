'use client';

import { UserRole } from '@/features/users/types/user-role';
import { useAuth } from '@/shared/hooks/useAuth';
import { Dropdown } from '@heroui/react';
import { Key, ReactNode } from 'react';

export interface DropdownItem {
    id: string;
    label: string | ReactNode;
    variant?: 'default' | 'danger';
    onAction?: (key: Key) => void;
    icon?: ReactNode;
    shouldCloseOnSelect?: boolean;
    role?: UserRole[];
}

interface DropDownCustomProps {
    items: DropdownItem[];
    trigger: ReactNode;
    placement?:
        | 'bottom'
        | 'bottom left'
        | 'bottom right'
        | 'bottom start'
        | 'bottom end'
        | 'top'
        | 'top left'
        | 'top right'
        | 'top start'
        | 'top end'
        | 'left'
        | 'left top'
        | 'left bottom'
        | 'start'
        | 'start top'
        | 'start bottom'
        | 'right'
        | 'right top'
        | 'right bottom'
        | 'end'
        | 'end top'
        | 'end bottom';
    triggerClassName?: string;
}

function DropDownCustom({
    items,
    trigger,
    placement = 'bottom',
    triggerClassName,
}: DropDownCustomProps) {
    const { role } = useAuth();

    const handleItemAction = (item: DropdownItem) => {
        if (item.onAction) {
            item.onAction(item.id);
            return;
        }
    };

    return (
        <Dropdown>
            <Dropdown.Trigger className={triggerClassName}>{trigger}</Dropdown.Trigger>
            <Dropdown.Popover placement={placement}>
                <Dropdown.Menu className="bg-[#f5efeb]">
                    {items
                        .filter(
                            (item) =>
                                !item.role || (item.role && item.role.includes(role as UserRole))
                        )
                        .map((item) => (
                            <Dropdown.Item
                                key={item.id}
                                textValue={item.label as string}
                                variant={item.variant}
                                onAction={() => handleItemAction(item)}
                                shouldCloseOnSelect={item.shouldCloseOnSelect}
                            >
                                <div className="flex items-center gap-2">
                                    {item.icon ? (
                                        <span className="flex items-center">{item.icon}</span>
                                    ) : null}
                                    {item.label}
                                </div>
                            </Dropdown.Item>
                        ))}
                </Dropdown.Menu>
            </Dropdown.Popover>
        </Dropdown>
    );
}

export default DropDownCustom;
