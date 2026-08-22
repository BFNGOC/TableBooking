'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';

import { socket } from './socket';

export default function SocketConnectionListener() {
    const { status } = useSession();

    useEffect(() => {
        if (status === 'authenticated') {
            if (!socket.connected) {
                socket.connect();
            }
        }

        if (status === 'unauthenticated') {
            if (socket.connected) {
                socket.disconnect();
            }
        }
    }, [status]);

    return null;
}
