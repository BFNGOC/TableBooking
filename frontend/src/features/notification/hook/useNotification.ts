import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
    findAllNotification,
    getUnreadCountApi,
    markAllAsReadNotification,
    markAsReadNotification,
} from '../api/notification-api';
import { notificationKeys } from '../constants/query-key';

export const useNotifications = () => {
    return useQuery({
        queryKey: notificationKeys.list(),
        queryFn: findAllNotification,
    });
};

export const useUnreadNotificationCount = () => {
    return useQuery({
        queryKey: notificationKeys.unreadCount(),
        queryFn: getUnreadCountApi,
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
        },
    });
};
