'use client';

import { Chip } from '@heroui/react';

interface StatusTagProps {
    status?: boolean;
    statusText?: string;
}

function StatusTag({ status, statusText }: StatusTagProps) {
    switch (status) {
        case true:
            return (
                <Chip color="success" variant="primary">
                    {statusText || 'Kích hoạt'}
                </Chip>
            );

        case false:
            return (
                <Chip color="danger" variant="primary">
                    {statusText || 'Vô hiệu hóa'}
                </Chip>
            );

        default:
            return <Chip>{statusText || 'Không xác định'}</Chip>;
    }
}

export default StatusTag;
