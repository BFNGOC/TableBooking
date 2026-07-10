import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { UserRole } from '@/features/users/types/user-role';

const guestOnlyRoutes = ['/login', '/register', '/verify-email'];

const protectedRoutes = ['/reservations', '/settings', '/profile'];

/**
 * Access Rights
 *
 * CUSTOMER = 1
 * RESTAURANT = 2 (includes CUSTOMER rights)
 * ADMIN = 3 (includes all rights)
 */
const accessLevel: Record<UserRole, number> = {
    CUSTOMER: 1,
    RESTAURANT: 2,
    ADMIN: 3,
};

/**
 * Each route requires a minimum level
 */
const roleRoutes: Record<string, number> = {
    '/restaurant': accessLevel.RESTAURANT,
    '/admin': accessLevel.ADMIN,
};

const redirectByRole: Record<UserRole, string> = {
    CUSTOMER: '/',
    RESTAURANT: '/restaurant/dashboard',
    ADMIN: '/admin/dashboard',
};

export default auth((req) => {
    const { nextUrl, auth: session } = req;
    const pathname = nextUrl.pathname;

    /**
     * Guest only
     */
    if (guestOnlyRoutes.some((route) => pathname.startsWith(route))) {
        if (session) {
            return NextResponse.redirect(
                new URL(redirectByRole[session.user.role as UserRole], nextUrl)
            );
        }

        return NextResponse.next();
    }

    /**
     * Just log in
     */
    if (protectedRoutes.some((route) => pathname.startsWith(route))) {
        if (!session) {
            return NextResponse.redirect(new URL('/login', nextUrl));
        }

        return NextResponse.next();
    }
    /**
     * Check permissions
     */
    const matchedRoute = Object.entries(roleRoutes).find(([prefix]) => pathname.startsWith(prefix));

    if (matchedRoute) {
        if (!session) {
            return NextResponse.redirect(new URL('/login', nextUrl));
        }

        const [, requiredLevel] = matchedRoute;

        const userLevel = accessLevel[session.user.role as UserRole];

        if (userLevel < requiredLevel) {
            return NextResponse.redirect(
                new URL(redirectByRole[session.user.role as UserRole], nextUrl)
            );
        }
    }

    return NextResponse.next();
});

export const config = {
    matcher: [
        // Guest
        '/login',
        '/register',
        '/verify-email',

        // Auth
        '/reservations/:path*',
        '/settings/:path*',
        '/profile/:path*',

        // Role
        '/restaurant/:path*',
        '/admin/:path*',
    ],
};
