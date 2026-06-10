import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { sendRequest } from './utils/api';
import { IUser } from './types/next-auth';

interface ILoginResponse {
    user: IUser;
    access_token: string;
    refresh_token: string;
}

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Credentials({
            // You can specify which fields should be submitted, by adding keys to the `credentials` object.
            // e.g. domain, username, password, 2FA token, etc.
            credentials: {
                email: {},
                password: {},
            },
            authorize: async (credentials) => {
                try {
                    const response = await sendRequest<ILoginResponse>({
                        url: '${NEXT_BACKEND_API_URL}/auth/login',
                        method: 'POST',
                        body: credentials,
                    });

                    if (response.error || !response.data) {
                        const errorMessage = Array.isArray(response.error)
                            ? response.error.join(', ')
                            : response.message || response.error || 'Đăng nhập thất bại';
                        throw new Error(errorMessage);
                    }

                    return {
                        _id: response.data.user._id,
                        name: response.data.user.name,
                        email: response.data.user.email,
                        access_token: response.data.access_token,
                    };
                } catch (error: any) {
                    throw new Error(error.message || 'Đăng nhập thất bại');
                }
            },
        }),
    ],
    pages: {
        signIn: '/login',
    },
    callbacks: {
        jwt({ token, user }) {
            if (user) {
                token.user = user as IUser;
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
