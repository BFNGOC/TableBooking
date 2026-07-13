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
		async signIn({ user, account, profile }) {
			if (
				account?.provider === "google" &&
				account.id_token &&
				profile?.email
			) {
				try {
					const response = await googleLoginApi({
						idToken: account.id_token,
						providerId: account.providerAccountId,
					});
					console.log("Google response:", response);
					const backendPayload = response?.data ?? response;
					const backendUser = backendPayload?.user;
					const accessToken = backendPayload?.access_token;
					console.log({
						backendPayload,
						backendUser,
						accessToken,
					});
					if (!backendUser || !accessToken) {
						return false;
					}

					const mappedUser = buildUserFromBackend(backendUser);
					Object.assign(user, mappedUser, { accessToken });
					return true;
				} catch (error) {
					console.error("Google signIn callback failed", error);
					return false;
				}
			}

			return true;
		},
		jwt({ token, user, account }) {
			if (account?.provider === "google") {
				token.idToken = account.id_token;
				token.providerAccountId = account.providerAccountId;
			}

			if (user) {
				token.user = user;
			}

			return token;
		},
		session({ session, token }) {
			const user = token.user as IUser & {
				id?: string;
				emailVerified?: Date | null;
			};
			session.user = {
				...user,
				id: user._id ?? user.id ?? "",
				emailVerified: user.emailVerified ?? null,
			};
			session.idToken = token.idToken as string | undefined;
			session.providerAccountId = token.providerAccountId as
				| string
				| undefined;
			return session;
		},
		authorized: async ({ auth }) => {
			// Logged in users are authenticated, otherwise redirect to login page
			return !!auth;
		},
	},
});
