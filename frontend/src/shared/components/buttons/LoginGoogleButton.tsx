'use client';

import { Button } from '@heroui/react';
import { Icon } from '@iconify/react';

function LoginGoogleButton() {
    return (
        <Button className="w-full" variant="tertiary">
            <Icon icon="devicon:google" />
            Sign in with Google
        </Button>
    );
}

export default LoginGoogleButton;
