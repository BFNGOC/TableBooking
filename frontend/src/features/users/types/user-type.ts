import { ImageType } from '@/features/upload/types/image';
import { UserRole } from './user-role';

export type AccountType = 'LOCAL' | 'GOOGLE';

export type Gender = 'MALE' | 'FEMALE' | 'OTHER';

export interface IUser {
    _id: string;

    name: string;
    email: string;
    password?: string;

    accountType: AccountType;
    role: UserRole;

    isActive: boolean;

    verificationCodeId?: string;
    verificationCodeExpires?: string | Date;

    address?: string;
    phone?: string;
    avatar?: ImageType | null;

    refreshToken?: string;

    lastLoginAt?: string | Date;

    gender?: Gender;
    dateOfBirth?: string | Date;
}
