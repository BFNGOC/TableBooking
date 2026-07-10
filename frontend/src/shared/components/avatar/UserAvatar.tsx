import { useAuth } from '@/shared/hooks/useAuth';
import { Avatar, Skeleton } from '@heroui/react';

interface UserAvatarProps {
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

function UserAvatar({ size = 'md', className }: UserAvatarProps) {
    const { user, isAuthLoading } = useAuth();

    const displayName = user?.name?.trim() || 'User';
    const avatarUrl = user?.avatar?.url;
    const fallbackInitial = displayName.charAt(0).toUpperCase();

    if (isAuthLoading) {
        return (
            <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />

                <div className="flex min-w-0 flex-col gap-2">
                    <Skeleton className="h-4 w-24 rounded-md" />
                    <Skeleton className="h-3 w-36 rounded-md" />
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

                <span className="truncate text-xs text-default-500">{user?.email}</span>
            </div>
        </div>
    );
}

export default UserAvatar;
