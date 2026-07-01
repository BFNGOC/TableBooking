import { UserRole } from '../types/user-role';

export const USER_ROLE_OPTIONS: {
    id: string;
    text: UserRole;
}[] = [
    { id: 'Admin', text: 'ADMIN' },
    { id: 'Restaurant', text: 'RESTAURANT' },
    { id: 'User', text: 'USER' },
];
