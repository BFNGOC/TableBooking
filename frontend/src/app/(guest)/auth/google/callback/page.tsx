"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSession, signIn } from "next-auth/react";
import { googleLoginApi } from "@/features/auth/api/auth-api";
import { IUser } from "@/features/users/types/user-type";
import { buildUserFromBackend } from "@/shared/utils/build-user-from-backend";
import { useToast } from "@/shared/hooks/useToast";

export default function GoogleCallbackPage() {
	const router = useRouter();
	const { showToast } = useToast();

	useEffect(() => {
		const syncGoogleUser = async () => {
			try {
				const session = await getSession();
				const googleUser = session?.user as any;
				console.log({
					googleUser,
					email: googleUser.email,
					name: googleUser.name ?? googleUser.email,
					avatar: googleUser.image ?? undefined,
				});
				if (!googleUser?.email) {
					throw new Error("Không lấy được thông tin Google");
				}

				const response = await googleLoginApi({
					email: googleUser.email,
					name: googleUser.name ?? googleUser.email,
					avatar: googleUser.image ?? undefined,
				});

				const backendPayload = response?.data ?? response;
				const backendUser = backendPayload?.user;
				const accessToken = backendPayload?.access_token;

				if (!backendUser || !accessToken) {
					throw new Error("Không nhận được token từ backend");
				}

				const mappedUser = buildUserFromBackend(backendUser);
				const authUser = {
					...mappedUser,
					accessToken,
				} as IUser & { accessToken: string };

				const result = await signIn("credentials", {
					redirect: false,
					accessToken,
					user: JSON.stringify(authUser),
				});

				if (result?.error) {
					throw new Error(result.error);
				}

				router.replace("/");
			} catch (error: any) {
				console.error("Google callback error", error);
				showToast(
					"error",
					"Đăng nhập Google thất bại",
					error?.message ?? "Vui lòng thử lại",
				);
				router.replace("/login");
			}
		};

		syncGoogleUser();
	}, [router, showToast]);

	return null;
}
