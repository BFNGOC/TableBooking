import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { IUser } from './features/users/types/user-type';

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Credentials({
            // You can specify which fields should be submitted, by adding keys to the `credentials` object.
            // e.g. domain, username, password, 2FA token, etc.
            credentials: {
                accessToken: {},
                // refreshToken: {},
                user: {},
            },

            authorize: async (credentials) => {
                if (!credentials?.accessToken || !credentials?.user) {
                    return null;
                }

                const user = JSON.parse(credentials.user as string);

                return {
                    ...user,
                    accessToken: credentials.accessToken,
                    // refreshToken: credentials.refreshToken,
                };
            },
        }),
    ],
    pages: {
        signIn: '/login',
    },
    callbacks: {
        jwt({ token, user }) {
            if (user) {
                token.user = user;
            }

            return token;
        },
        session({ session, token }) {
            session.user = token.user as IUser;
            return session;
        },
        authorized: async ({ auth }) => {
            // Logged in users are authenticated, otherwise redirect to login page
            return !!auth;
        },
    },
});
