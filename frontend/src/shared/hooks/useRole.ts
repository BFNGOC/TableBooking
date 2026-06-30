import { useSession } from 'next-auth/react';

export const useRole = () => {
    const { data } = useSession();
    return data?.user?.role;
};
