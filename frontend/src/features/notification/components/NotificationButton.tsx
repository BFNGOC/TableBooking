'use client';

import { Badge, Button, Popover, Spinner, Tabs } from '@heroui/react';
import { Bell, CheckCheck } from 'lucide-react';
import { useState } from 'react';

import {
    useMarkAllNotificationsAsRead,
    useMarkNotificationAsRead,
    useNotifications,
    useUnreadNotificationCount,
    useUnreadNotifications,
} from '../hook/useNotification';
import { INotification } from '../types/notification.type';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/shared/hooks/useAuth';

export default function NotificationButton({ title }: { title?: string }) {
    const router = useRouter();
    const { role } = useAuth();
    const isRestaurant = role?.toUpperCase() === 'RESTAURANT';

    const [filter, setFilter] = useState<'all' | 'unread'>('all');

    const {
        data: notificationResponse,
        isLoading: isLoadingNotifications,
        fetchNextPage: fetchNextNotifications,
        hasNextPage: hasNextNotifications,
        isFetchingNextPage: isFetchingNextNotifications,
    } = useNotifications();

    const {
        data: unreadResponse,
        fetchNextPage: fetchNextUnread,
        hasNextPage: hasNextUnread,
        isFetchingNextPage: isFetchingNextUnread,
    } = useUnreadNotifications();

    const { data: unreadCountResponse } = useUnreadNotificationCount();

    const markAsReadMutation = useMarkNotificationAsRead();
    const markAllAsReadMutation = useMarkAllNotificationsAsRead();

    // ============================================
    // GET NOTIFICATIONS
    // ============================================

    const notifications: INotification[] =
        notificationResponse?.pages?.flatMap((page: any) => page?.data?.data ?? []) ?? [];

    const unreadNotifications: INotification[] =
        unreadResponse?.pages?.flatMap((page: any) => page?.data?.data ?? []) ?? [];

    // ============================================
    // GET UNREAD COUNT
    // ============================================

    const unreadCount =
        unreadCountResponse &&
        typeof unreadCountResponse === 'object' &&
        'data' in unreadCountResponse
            ? Number((unreadCountResponse as { data: number }).data ?? 0)
            : 0;

    // ============================================
    // FILTER NOTIFICATIONS
    // ============================================

    const visibleNotifications = filter === 'unread' ? unreadNotifications : notifications;

    // ============================================
    // MARK AS READ
    // ============================================

    const handleNotificationClick = (notification: INotification) => {
        if (!notification.isRead) {
            markAsReadMutation.mutate(notification._id);
        }

        console.log('notification', notification);

        switch (notification.type) {
            case 'BOOKING':
                router.push(
                    isRestaurant
                        ? '/restaurant/dashboard/bookings/upcoming'
                        : notification.referenceId && notification.data?.restaurantSlug
                          ? `/restaurants/${notification.data.restaurantSlug}/booking/success/${notification.referenceId}`
                          : '/my-bookings'
                );
                break;

            case 'PAYMENT':
                router.push(
                    isRestaurant
                        ? '/restaurant/dashboard/bookings/upcoming'
                        : notification.referenceId
                          ? `/checkout/${notification.referenceId}`
                          : '/my-bookings'
                );
                break;

            case 'REVIEW':
                router.push(isRestaurant ? '/restaurant/dashboard' : '/my-bookings');
                break;

            default:
                break;
        }
    };
    // ============================================
    // MARK ALL AS READ
    // ============================================

    const handleMarkAllAsRead = () => {
        if (unreadCount === 0) return;

        markAllAsReadMutation.mutate();
    };

    // ============================================
    // FORMAT DATE
    // ============================================

    const formatNotificationDate = (date: string) => {
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
    };

    return (
        <Popover>
            <Popover.Trigger>
                <Badge.Anchor color="danger">
                    <div className="flex items-center gap-2">
                        <Button isIconOnly variant="danger-soft" aria-label="Thông báo">
                            <Bell size={20} />
                        </Button>

                        {title && <span className="font-medium text-gray-700">{title}</span>}
                    </div>

                    {unreadCount > 0 && (
                        <Badge color="danger" size="sm">
                            {unreadCount > 99 ? '99+' : String(unreadCount)}
                        </Badge>
                    )}
                </Badge.Anchor>
            </Popover.Trigger>

            <Popover.Content placement="bottom end" className="w-96 max-w-[calc(100vw-2rem)]">
                <Popover.Dialog>
                    {/* HEADER */}
                    <div className="border-b border-divider px-4 py-2">
                        <div className="flex w-full items-center justify-between gap-4">
                            <span className="text-sm font-semibold text-foreground">Thông báo</span>

                            <Button
                                size="sm"
                                variant="ghost"
                                isDisabled={unreadCount === 0 || markAllAsReadMutation.isPending}
                                onPress={handleMarkAllAsRead}
                                className="h-8 px-2"
                            >
                                <CheckCheck size={15} />
                                Đọc tất cả
                            </Button>
                        </div>

                        <Tabs
                            selectedKey={filter}
                            onSelectionChange={(key) => setFilter(key as 'all' | 'unread')}
                            className="mt-2 w-full"
                            variant="primary"
                        >
                            <Tabs.ListContainer>
                                <Tabs.List className="w-full justify-start gap-5 bg-transparent p-0">
                                    <Tabs.Tab
                                        id="all"
                                        className="px-1 py-2 text-sm data-[selected=true]:text-gray-700"
                                    >
                                        Tất cả
                                        <Tabs.Indicator className="bg-[#f5efeb]" />
                                    </Tabs.Tab>

                                    <Tabs.Tab
                                        id="unread"
                                        className="px-1 py-2 text-sm data-[selected=true]:text-gray-700"
                                    >
                                        <div className="flex items-center gap-1.5">
                                            Chưa đọc
                                            <span className="size-1.5 rounded-full bg-[#f5efeb]" />
                                        </div>

                                        <Tabs.Indicator className="bg-[#f5efeb]" />
                                    </Tabs.Tab>
                                </Tabs.List>
                            </Tabs.ListContainer>
                        </Tabs>
                    </div>

                    {/* CONTENT */}
                    {isLoadingNotifications ? (
                        <div className="flex justify-center px-4 py-5" role="status">
                            <Spinner size="sm" />
                        </div>
                    ) : visibleNotifications.length === 0 ? (
                        <div className="px-4" role="status">
                            <span className="block py-5 text-center text-sm text-muted">
                                {filter === 'unread'
                                    ? 'Bạn đã đọc tất cả thông báo'
                                    : 'Bạn chưa có thông báo nào'}
                            </span>
                        </div>
                    ) : (
                        <div>
                            {visibleNotifications.map((notification) => {
                                const isRead = notification.isRead;

                                const message =
                                    notification.title ??
                                    notification.message ??
                                    'Bạn có một thông báo mới';

                                return (
                                    <button
                                        key={notification._id}
                                        type="button"
                                        onClick={() => handleNotificationClick(notification)}
                                        className={`w-full cursor-pointer text-left transition-colors hover:bg-amber-500/10 ${
                                            isRead ? 'opacity-70' : 'bg-primary/5'
                                        }`}
                                    >
                                        <div className="flex w-full items-start gap-3 px-4 py-3">
                                            {/* UNREAD DOT */}
                                            <span
                                                className={`mt-1.5 size-2 shrink-0 rounded-full ${
                                                    isRead ? 'bg-transparent' : 'bg-danger'
                                                }`}
                                            />

                                            {/* CONTENT */}
                                            <div className="min-w-0 flex-1">
                                                <p className="whitespace-normal text-sm text-foreground">
                                                    {message}
                                                </p>

                                                {notification.createdAt && (
                                                    <p className="mt-1 text-xs text-muted">
                                                        {formatNotificationDate(
                                                            notification.createdAt
                                                        )}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </button>
                                );
                            })}

                            {(filter === 'all' && hasNextNotifications) ||
                            (filter === 'unread' && hasNextUnread) ? (
                                <div className="flex justify-center px-6">
                                    <Button
                                        size="sm"
                                        variant="danger-soft"
                                        onPress={() =>
                                            filter === 'all'
                                                ? fetchNextNotifications()
                                                : fetchNextUnread()
                                        }
                                        isPending={
                                            filter === 'all'
                                                ? isFetchingNextNotifications
                                                : isFetchingNextUnread
                                        }
                                    >
                                        Xem thêm
                                    </Button>
                                </div>
                            ) : null}
                        </div>
                    )}
                </Popover.Dialog>
            </Popover.Content>
        </Popover>
    );
}
