import { auth } from '@/auth';
import { getRedirectPathByRole } from '@/features/auth/utils/redireact-path-role';
import { redirect } from 'next/navigation';

export default async function AuthCallbackPage() {
    const session = await auth();

    if (!session) {
        redirect('/login');
    }

    redirect(getRedirectPathByRole(session.user.role));
}
