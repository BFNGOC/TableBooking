'use client';

import { Button } from '@heroui/react';
import { Icon } from '@iconify/react';
import { signIn } from 'next-auth/react';

function LoginGoogleButton() {
    const handleGoogleLogin = async () => {
        await signIn('google', {
            callbackUrl: '/google-callback',
            redirect: true,
        });
    };

    return (
        <Button className="w-full" variant="tertiary" onPress={handleGoogleLogin}>
            <Icon icon="devicon:google" />
            Sign in with Google
        </Button>
    );
}

export default LoginGoogleButton;
