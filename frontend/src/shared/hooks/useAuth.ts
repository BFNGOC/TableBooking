import { useSession } from 'next-auth/react';
import { useGetMe } from '@/features/users/hooks/useGetMe';

export function useAuth() {
    const { data: session, status } = useSession();
    const query = useGetMe();

    const isAuthLoading = status === 'loading' || (status === 'authenticated' && query.isLoading);

    return {
        session,
        user: query.data,
        status,
        isAuthenticated: status === 'authenticated',
        isUnauthenticated: status === 'unauthenticated',
        isAuthLoading,
        hasUser: !!query.data,
    };
}
