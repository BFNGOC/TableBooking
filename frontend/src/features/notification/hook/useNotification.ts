import { useMutation, useQuery, useInfiniteQuery, useQueryClient } from '@tanstack/react-query';

import {
    findAllNotification,
    findAllUnread,
    getUnreadCountApi,
    markAllAsReadNotification,
    markAsReadNotification,
} from '../api/notification-api';
import { notificationKeys } from '../constants/query-key';
import { useSession } from 'next-auth/react';

export const useNotifications = () => {
    const { status } = useSession();

    return useInfiniteQuery({
        queryKey: notificationKeys.list(),
        queryFn: ({ pageParam = 1 }) => findAllNotification({ pageParam }),
        getNextPageParam: (lastPage: any) => {
            return lastPage?.data?.hasMore ? lastPage.data.page + 1 : undefined;
        },
        initialPageParam: 1,
        staleTime: 30 * 1000,
        enabled: status === 'authenticated',
    });
};

export const useUnreadNotifications = () => {
    const { status } = useSession();

    return useInfiniteQuery({
        queryKey: notificationKeys.unread(),
        queryFn: ({ pageParam = 1 }) => findAllUnread({ pageParam }),
        getNextPageParam: (lastPage: any) => {
            return lastPage?.data?.hasMore ? lastPage.data.page + 1 : undefined;
        },
        initialPageParam: 1,
        staleTime: 30 * 1000,
        enabled: status === 'authenticated',
    });
};

export const useUnreadNotificationCount = () => {
    const { status } = useSession();

    return useQuery({
        queryKey: notificationKeys.unreadCount(),
        queryFn: getUnreadCountApi,
        staleTime: 30 * 1000,
        enabled: status === 'authenticated',
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
