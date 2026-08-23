import { clientRequest } from '@/shared/library/axios/client-api';

const API_URL_PREFIX = '/notification';

export const getUnreadCountApi = async () => {
    const res = await clientRequest<any>({
        url: `${API_URL_PREFIX}/unread-count`,
        method: 'GET',
    });

    return res;
};

export const findAllNotification = async ({
    pageParam = 1,
}: {
    pageParam?: number;
}) => {
    const res = await clientRequest<any>({
        url: `${API_URL_PREFIX}?page=${pageParam}&limit=5`,
        method: 'GET',
    });

    return res;
};

export const findAllUnread = async ({
    pageParam = 1,
}: {
    pageParam?: number;
}) => {
    const res = await clientRequest<any>({
        url: `${API_URL_PREFIX}/unread?page=${pageParam}&limit=5`,
        method: 'GET',
    });

    return res;
};

export const markAsReadNotification = async (notificationId: string) => {
    const res = await clientRequest<any>({
        url: `${API_URL_PREFIX}/mark-as-read/${notificationId}`,
        method: 'PATCH',
    });

    return res;
};

export const markAllAsReadNotification = async () => {
    const res = await clientRequest<any>({
        url: `${API_URL_PREFIX}/mark-all-as-read`,
        method: 'PATCH',
    });

    return res;
};
