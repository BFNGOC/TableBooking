import { UserRole } from '../types/user-role';
import { AccountType, Gender } from '../types/user-type';

export const USER_ROLE_OPTIONS: {
    id: string;
    text: UserRole;
}[] = [
    { id: 'ADMIN', text: 'ADMIN' },
    { id: 'RESTAURANT', text: 'RESTAURANT' },
    { id: 'CUSTOMER', text: 'CUSTOMER' },
];

export const USER_ACCOUNT_TYPE_OPTIONS: {
    id: string;
    text: AccountType;
}[] = [
    { id: 'LOCAL', text: 'LOCAL' },
    { id: 'GOOGLE', text: 'GOOGLE' },
];

export const USER_GENDER_TYPE_OPTIONS: {
    id: string;
    text: Gender;
}[] = [
    { id: 'MALE', text: 'MALE' },
    { id: 'FEMALE', text: 'FEMALE' },
    { id: 'OTHER', text: 'OTHER' },
];
