'use client';

import { useRestaurantMe } from '@/features/restaurant/hooks/useRestaurantMe';
import { Avatar, Skeleton } from '@heroui/react';

interface RestaurantAvatarProps {
    size?: 'sm' | 'md' | 'lg';

    className?: string;
}

function RestaurantAvatar({ size = 'md', className }: RestaurantAvatarProps) {
    const { data: restaurant, isPending } = useRestaurantMe();

    const displayName = restaurant?.restaurantName?.trim() || 'Restaurant';

    const avatarUrl = restaurant?.avatar?.url;

    const fallbackInitial = displayName.charAt(0).toUpperCase();

    if (isPending) {
        return (
            <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />

                <div className="flex min-w-0 flex-col gap-2">
                    <Skeleton className="h-4 w-32 rounded-md" />
                    <Skeleton className="h-3 w-20 rounded-md" />
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-3">
            <Avatar size={size} className={className}>
                {avatarUrl ? <Avatar.Image alt={displayName} src={avatarUrl} /> : null}

                <Avatar.Fallback>{fallbackInitial}</Avatar.Fallback>
            </Avatar>

            <div className="flex min-w-0 flex-col">
                <span className="truncate text-sm font-semibold text-foreground">
                    {displayName}
                </span>

                <span className="truncate text-xs text-default-500">Nhà hàng</span>
            </div>
        </div>
    );
}

export default RestaurantAvatar;
