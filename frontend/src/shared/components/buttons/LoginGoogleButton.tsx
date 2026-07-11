"use client";

import { Button } from "@heroui/react";
import { Icon } from "@iconify/react";

function LoginGoogleButton({ onClick }: { onClick: () => void }) {
	return (
		<Button className="w-full" variant="tertiary" onPress={onClick}>
			<Icon icon="devicon:google" />
			Sign in with Google
		</Button>
	);
}

export default LoginGoogleButton;
