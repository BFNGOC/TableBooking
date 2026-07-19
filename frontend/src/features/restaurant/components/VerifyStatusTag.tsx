'use client';

import { Chip } from '@heroui/react';
import { RestaurantVerifyStatus } from '../types/restaurant.type';

interface VerifyStatusProps {
    status?: RestaurantVerifyStatus;
    statusText?: string;
}

function VerifyStatus({ status, statusText }: VerifyStatusProps) {
    switch (status) {
        case RestaurantVerifyStatus.EMAIL_PENDING:
            return (
                <Chip color="accent" variant="primary">
                    {statusText || 'Xác thực email'}
                </Chip>
            );

        case RestaurantVerifyStatus.PENDING:
            return (
                <Chip color="warning" variant="primary">
                    {statusText || 'Đợi duyệt'}
                </Chip>
            );

        case RestaurantVerifyStatus.REJECTED:
            return (
                <Chip color="danger" variant="primary">
                    {statusText || 'Từ chối'}
                </Chip>
            );

        case RestaurantVerifyStatus.APPROVED:
            return (
                <Chip color="success" variant="primary">
                    {statusText || 'Thành công'}
                </Chip>
            );

        default:
            return <Chip>{statusText || 'Không xác định'}</Chip>;
    }
}

export default VerifyStatus;
