'use client';

import { io } from 'socket.io-client';
import { getSession } from 'next-auth/react';

const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:8080';

export const socket = io(socketUrl, {
    autoConnect: false,
    auth: async (callback) => {
        const session = await getSession();

        const accessToken = (session?.user as { accessToken?: string } | undefined)?.accessToken;

        callback({
            token: accessToken,
            accessToken,
        });
    },
});
