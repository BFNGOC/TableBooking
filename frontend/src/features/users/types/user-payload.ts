import { ImageType } from '@/features/upload/types/image';
import { UserRole } from './user-role';
import { AccountType, Gender } from './user-type';

export interface CreateUserPayload {
    name: string;
    email: string;
    password: string;

    role?: UserRole;
    accountType?: AccountType;
    isActive?: boolean;
    phone?: string;
    address?: string;
    avatar?: ImageType | null;
    gender?: Gender;
    dateOfBirth?: string;
}

export interface UpdateUserPayload {
    name?: string;
    email?: string;
    password?: string;

    role?: UserRole;
    accountType?: AccountType;
    isActive?: boolean;
    phone?: string;
    address?: string;
    avatar?: ImageType | null;
    gender?: Gender;
    dateOfBirth?: string;
}
