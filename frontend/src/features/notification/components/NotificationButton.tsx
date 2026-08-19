'use client';

import {
    Badge,
    Button,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownTrigger,
} from '@heroui/react';
import { Bell } from 'lucide-react';

import {
    useMarkAllNotificationsAsRead,
    useMarkNotificationAsRead,
    useNotifications,
    useUnreadNotificationCount,
} from '../hook/useNotification';

export default function NotificationButton() {
    const { data: notifications = [], isLoading: isLoadingNotifications } = useNotifications();

    const { data: unreadCount = 0 } = useUnreadNotificationCount();

    const markAsReadMutation = useMarkNotificationAsRead();
    const markAllAsReadMutation = useMarkAllNotificationsAsRead();

    const handleMarkAsRead = (notificationId: string) => {
        markAsReadMutation.mutate(notificationId);
    };

    const handleMarkAllAsRead = () => {
        if (unreadCount === 0) return;

        markAllAsReadMutation.mutate();
    };

    return (
        <Dropdown
            placement="bottom-end"
            classNames={{
                content: 'p-0 w-[380px]',
            }}
        >
            <DropdownTrigger>
                <Badge
                    content={unreadCount > 99 ? '99+' : unreadCount}
                    color="danger"
                    shape="circle"
                    isInvisible={unreadCount === 0}
                    size="sm"
                >
                    <Button isIconOnly variant="light" radius="full" aria-label="Thông báo">
                        <Bell size={21} />
                    </Button>
                </Badge>
            </DropdownTrigger>

            <DropdownMenu
                aria-label="Danh sách thông báo"
                className="max-h-[500px] overflow-y-auto p-0"
                disabledKeys={markAllAsReadMutation.isPending ? ['mark-all'] : []}
                topContent={
                    <div className="flex items-center justify-between px-4 py-3 border-b">
                        <div>
                            <h3 className="font-semibold text-base">Thông báo</h3>

                            {unreadCount > 0 && (
                                <p className="text-xs text-default-500">
                                    {unreadCount} thông báo chưa đọc
                                </p>
                            )}
                        </div>

                        {unreadCount > 0 && (
                            <DropdownItem key="mark-all" className="hidden">
                                Đánh dấu tất cả đã đọc
                            </DropdownItem>
                        )}
                    </div>
                }
            >
                {isLoadingNotifications ? (
                    <DropdownItem key="loading" className="h-20 justify-center" isReadOnly>
                        Đang tải thông báo...
                    </DropdownItem>
                ) : notifications.length === 0 ? (
                    <DropdownItem key="empty" className="h-20 justify-center" isReadOnly>
                        Không có thông báo
                    </DropdownItem>
                ) : (
                    notifications.map((notification) => (
                        <DropdownItem
                            key={notification._id}
                            className={`px-4 py-3 ${!notification.isRead ? 'bg-primary-50' : ''}`}
                            description={
                                <div className="flex flex-col gap-1">
                                    <span className="text-xs text-default-400">
                                        {formatNotificationDate(notification.createdAt)}
                                    </span>

                                    <span className="line-clamp-2">{notification.message}</span>
                                </div>
                            }
                            onPress={() => {
                                if (!notification.isRead) {
                                    handleMarkAsRead(notification._id);
                                }
                            }}
                        >
                            <div className="flex items-start gap-2">
                                {!notification.isRead && (
                                    <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
                                )}

                                <span className={notification.isRead ? '' : 'font-semibold'}>
                                    {notification.title}
                                </span>
                            </div>
                        </DropdownItem>
                    ))
                )}
            </DropdownMenu>
        </Dropdown>
    );
}

function formatNotificationDate(date: string) {
    const notificationDate = new Date(date);
    const now = new Date();

    const diff = Math.floor((now.getTime() - notificationDate.getTime()) / 1000);

    if (diff < 60) {
        return 'Vừa xong';
    }

    if (diff < 3600) {
        return `${Math.floor(diff / 60)} phút trước`;
    }

    if (diff < 86400) {
        return `${Math.floor(diff / 3600)} giờ trước`;
    }

    if (diff < 604800) {
        return `${Math.floor(diff / 86400)} ngày trước`;
    }

    return notificationDate.toLocaleDateString('vi-VN');
}
