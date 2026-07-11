import { signIn } from "next-auth/react";

export const useGoogleLogin = () => {
	const handleGoogleLogin = async () => {
		await signIn("google", {
			callbackUrl: "/auth/google/callback",
			redirect: true,
		});
	};

	return { handleGoogleLogin };
};
