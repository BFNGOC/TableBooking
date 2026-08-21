export const notificationKeys = {
    all: ['notifications'] as const,
    list: () => [...notificationKeys.all, 'list'] as const,
    unread: () => [...notificationKeys.all, 'unread'] as const,
    unreadCount: () => [...notificationKeys.all, 'unread-count'] as const,
};
