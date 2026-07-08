import { Dropdown } from '@heroui/react';
import { Key, ReactNode } from 'react';

interface DropdownItem {
    id: string;
    label: string | ReactNode;
    variant?: 'default' | 'danger';
    onAction?: (key: Key) => void;
    icon?: ReactNode;
}

interface DropDownCustomProps {
    items: DropdownItem[];
    trigger: ReactNode;
}

function DropDownCustom({ items, trigger }: DropDownCustomProps) {
    const handleItemAction = (item: DropdownItem) => {
        if (item.onAction) {
            item.onAction(item.id);
            return;
        }
    };

    return (
        <Dropdown>
            <Dropdown.Trigger>{trigger}</Dropdown.Trigger>
            <Dropdown.Popover>
                <Dropdown.Menu className="bg-[#f5efeb]">
                    {items.map((item) => (
                        <Dropdown.Item
                            key={item.id}
                            textValue={item.label as string}
                            variant={item.variant}
                            onAction={() => handleItemAction(item)}
                        >
                            <div className="flex items-center gap-2">
                                {item.icon ? (
                                    <span className="flex items-center">{item.icon}</span>
                                ) : null}
                                <span>{item.label}</span>
                            </div>
                        </Dropdown.Item>
                    ))}
                </Dropdown.Menu>
            </Dropdown.Popover>
        </Dropdown>
    );
}

export default DropDownCustom;
