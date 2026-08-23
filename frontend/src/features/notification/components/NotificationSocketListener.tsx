'use client';

import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import { socket } from '@/shared/library/socket/socket';
import { notificationKeys } from '../constants/query-key';
import { SOCKET_EVENTS } from '@/shared/constants/socket-constants';

export default function NotificationSocketListener() {
    const queryClient = useQueryClient();

    useEffect(() => {
        const handleNewNotification = () => {
            console.log('New notification received via socket');

            queryClient.invalidateQueries({
                queryKey: notificationKeys.list(),
            });

            queryClient.invalidateQueries({
                queryKey: notificationKeys.unread(),
            });

            queryClient.invalidateQueries({
                queryKey: notificationKeys.unreadCount(),
            });
        };

        socket.on(SOCKET_EVENTS.NOTIFICATION_NEW, handleNewNotification);

        return () => {
            socket.off(SOCKET_EVENTS.NOTIFICATION_NEW, handleNewNotification);
        };
    }, [queryClient]);

    return null;
}
