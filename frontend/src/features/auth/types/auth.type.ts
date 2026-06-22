import { IUser } from '@/shared/types/next-auth';

export interface ILoginResponse {
    user: IUser;
    access_token: string;
    refresh_token: string;
}

export interface IRegisterResponse {
    user: IUser;
}

export type LoginPayload = {
    email: string;
    password: string;
};

export type RegisterPayload = {
    name: string;
    email: string;
    password: string;
};

export type VerifyPayload = {
    _id: string;
    code: string;
};

export type RetryActivePayload = {
    email: string;
};
