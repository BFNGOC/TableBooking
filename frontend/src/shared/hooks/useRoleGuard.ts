'use client';

import { UserRole } from '@/features/users/types/user-role';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export const useRoleGuard = (role: UserRole) => {
    const { data, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === 'loading') return;

        if (!data) {
            router.replace('/login');
            return;
        }

        if (data.user.role !== role) {
            router.replace('/');
        }
    }, [data, status]);
};
