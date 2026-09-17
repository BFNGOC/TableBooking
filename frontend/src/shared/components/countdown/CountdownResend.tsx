'use client';

import { Button } from '@heroui/react';
import { useEffect, useMemo, useState } from 'react';

interface CountdownResendProps {
    expiresAt?: string | Date | null;
    onResend: () => void | Promise<void>;
    isResending?: boolean;
    className?: string;
}

function CountdownResend({
    expiresAt,
    onResend,
    isResending = false,
    className,
}: CountdownResendProps) {
    const [now, setNow] = useState(Date.now());

    useEffect(() => {
        if (!expiresAt) return;

        const interval = setInterval(() => {
            setNow(Date.now());
        }, 1000);

        return () => clearInterval(interval);
    }, [expiresAt]);

    const remainingSeconds = useMemo(() => {
        if (!expiresAt) return 0;

        const expireTime = new Date(expiresAt).getTime();

        return Math.max(0, Math.floor((expireTime - now) / 1000));
    }, [expiresAt, now]);

    const isExpired = remainingSeconds <= 0;

    const minutes = Math.floor(remainingSeconds / 60);

    const seconds = remainingSeconds % 60;

    return (
        <div className={className}>
            {isExpired ? (
                <Button size="sm" variant="danger-soft" isPending={isResending} onPress={onResend}>
                    Gửi lại mã xác thực
                </Button>
            ) : (
                <span className="text-sm text-gray-500">
                    Mã xác thực sẽ hết hạn sau{' '}
                    <strong>
                        {minutes}:{seconds.toString().padStart(2, '0')}
                    </strong>
                </span>
            )}
        </div>
    );
}

export default CountdownResend;
