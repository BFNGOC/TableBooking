import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
    findAllNotification,
    findAllUnread,
    getUnreadCountApi,
    markAllAsReadNotification,
    markAsReadNotification,
} from '../api/notification-api';
import { notificationKeys } from '../constants/query-key';

export const useNotifications = () => {
    return useQuery({
        queryKey: notificationKeys.list(),
        queryFn: findAllNotification,
        staleTime: 30 * 1000,
    });
};

export const useUnreadNotifications = () => {
    return useQuery({
        queryKey: notificationKeys.unread(),
        queryFn: findAllUnread,
        staleTime: 30 * 1000,
    });
};

export const useUnreadNotificationCount = () => {
    return useQuery({
        queryKey: notificationKeys.unreadCount(),
        queryFn: getUnreadCountApi,
        staleTime: 30 * 1000,
    });
};

export const useMarkNotificationAsRead = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: markAsReadNotification,

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: notificationKeys.list(),
            });

            queryClient.invalidateQueries({
                queryKey: notificationKeys.unreadCount(),
            });
            queryClient.invalidateQueries({
                queryKey: notificationKeys.unread(),
            });
        },
    });
};

export const useMarkAllNotificationsAsRead = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: markAllAsReadNotification,

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: notificationKeys.list(),
            });

            queryClient.invalidateQueries({
                queryKey: notificationKeys.unreadCount(),
            });
            queryClient.invalidateQueries({
                queryKey: notificationKeys.unread(),
            });
        },
    });
};
