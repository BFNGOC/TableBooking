import { useGetMe } from '@/features/users/hooks/useGetMe';
import { Avatar } from '@heroui/react';

interface AvatarCustomProps {
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

function AvatarCustom({ size = 'md', className }: AvatarCustomProps) {
    const { data: user, isLoading } = useGetMe();

    const displayName = user?.name?.trim() || 'User';
    const avatarUrl = user?.avatar?.url;
    const fallbackInitial = displayName.charAt(0).toUpperCase();

    if (isLoading) {
        return null;
    }

    return (
        <Avatar size={size} className={className}>
            {avatarUrl ? <Avatar.Image alt={displayName} src={avatarUrl} /> : null}
            <Avatar.Fallback>{fallbackInitial}</Avatar.Fallback>
        </Avatar>
    );
}

export default AvatarCustom;
