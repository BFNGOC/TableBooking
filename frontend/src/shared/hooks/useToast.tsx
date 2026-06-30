'use client';

import { toast } from '@heroui/react';
import { Icon } from '@iconify/react';

type ToastType = 'success' | 'error' | 'warning' | 'info';

const config = {
    success: {
        variant: 'success' as const,
        icon: 'solar:check-circle-bold-duotone',
    },
    error: {
        variant: 'danger' as const,
        icon: 'solar:close-circle-bold-duotone',
    },
    warning: {
        variant: 'warning' as const,
        icon: 'solar:danger-triangle-bold-duotone',
    },
    info: {
        variant: 'accent' as const,
        icon: 'solar:info-circle-bold-duotone',
    },
};

export const useToast = () => {
    const showToast = (type: ToastType, title: string, description?: string) => {
        const item = config[type];

        toast(title, {
            description,
            variant: item.variant,
            timeout: 4000,
            indicator: <Icon icon={item.icon} width={24} className="shrink-0" />,
        });
    };

    return {
        showToast,
    };
};
