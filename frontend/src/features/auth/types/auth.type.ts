import { IUser } from '@/shared/types/next-auth';

export interface ILoginResponse {
    user: IUser;
    access_token: string;
    refresh_token: string;
}

export type LoginPayload = {
    email: string;
    password: string;
};
