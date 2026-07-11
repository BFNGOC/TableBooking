import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";

import { IUser } from "./features/users/types/user-type";
import { buildUserFromBackend } from "@/shared/utils/build-user-from-backend";
import { googleLoginApi } from "@/features/auth/api/auth-api";

export const { handlers, signIn, signOut, auth } = NextAuth({
	providers: [
		Credentials({
			credentials: {
				accessToken: {},
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
				};
			},
		}),

		Google({
			clientId: process.env.GOOGLE_CLIENT_ID!,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
		}),
	],
	pages: {
		signIn: "/login",
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
