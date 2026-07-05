import { UserRole } from '../types/user-role';

export const USER_ROLE_OPTIONS: {
    id: string;
    text: UserRole;
}[] = [
    { id: 'ADMIN', text: 'ADMIN' },
    { id: 'RESTAURANT', text: 'RESTAURANT' },
    { id: 'CUSTOMER', text: 'CUSTOMER' },
];
