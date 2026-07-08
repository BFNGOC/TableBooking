'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useGetMe } from '@/features/users/hooks/useGetMe';

export default function AppInit({ children }: { children: React.ReactNode }) {
    const { data: session, status } = useSession();
    const { refetch, isFetched } = useGetMe();

    const hasToken = Boolean((session?.user as { accessToken?: string } | undefined)?.accessToken);

    useEffect(() => {
        if (status !== 'authenticated' || !hasToken || isFetched) {
            return;
        }

        void refetch();
    }, [hasToken, isFetched, refetch, status]);

    return <>{children}</>;
}
