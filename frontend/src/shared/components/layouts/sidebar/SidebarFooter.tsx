'use client';

import { Button, Switch } from '@heroui/react';
import UserAvatar from '../../avatar/UserAvatar';
import { signOut } from 'next-auth/react';
import { useToast } from '@/shared/hooks/useToast';
import DropDownCustom, { DropdownItem } from '../../dropdown/DropdownCustom';
import { Moon, Palette, Settings, Sun } from 'lucide-react';
import { useRouter } from 'next/navigation';
import NotificationButton from '@/features/notification/components/NotificationButton';

function SidebarFooter() {
    const { showToast } = useToast();

    const router = useRouter();

    const handleLogout = async () => {
        await signOut({
            callbackUrl: '/',
        });

        showToast('success', 'Đăng xuất thành công');
    };

    const dropdownItems: DropdownItem[] = [
        {
            id: 'settings',
            label: 'Cài đặt',
            icon: <Settings size={16} />,
            onAction: () => router.push('/settings'),
        },
        {
            id: 'theme',
            label: (
                <div className="flex gap-3">
                    <div>Chủ đề</div>
                    <Switch size="lg">
                        {(
                            { isSelected } // Lấy thẳng isSelected từ hệ thống của HeroUI
                        ) => (
                            <Switch.Content>
                                <Switch.Control className="">
                                    <Switch.Thumb>
                                        <Switch.Icon className="w-full">
                                            {isSelected ? (
                                                <Sun className="size-3 text-inherit opacity-100" />
                                            ) : (
                                                <Moon className="size-3 text-inherit opacity-70" />
                                            )}
                                        </Switch.Icon>
                                    </Switch.Thumb>
                                </Switch.Control>
                            </Switch.Content>
                        )}
                    </Switch>
                </div>
            ),
            shouldCloseOnSelect: false,
            icon: <Palette size={16} />,
        },
    ];

    return (
        <div className="space-y-4">
            <div className="block rounded-lg px-4 py-3 transition hover:bg-[#f5efeb] hover:text-[#6f4e37]">
                <NotificationButton title="Thông báo" />
            </div>
            <DropDownCustom
                items={dropdownItems as any}
                trigger={<UserAvatar />}
                placement="top"
                triggerClassName="w-full"
            />

            <Button fullWidth variant="danger-soft" onPress={handleLogout}>
                Đăng xuất
            </Button>
        </div>
    );
}

export default SidebarFooter;
