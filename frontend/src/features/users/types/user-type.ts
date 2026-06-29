import { UserRole } from './user-role';

export type AccountType = 'LOCAL' | 'GOOGLE' | 'FACEBOOK';

export interface IUser {
    _id: string;

    name: string;
    email: string;
    password?: string;

    account_type: AccountType;
    role: UserRole;

    is_active: boolean;

    verification_code_id?: string;
    verification_code_expires?: string | Date;

    address?: string;
    phone?: string;
    avatar?: string;

    refreshToken?: string;

    lastLoginAt?: string | Date;
}
