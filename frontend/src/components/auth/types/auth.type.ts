import { IUser } from '@/types/next-auth';

export interface ILoginResponse {
    user: IUser;
    access_token: string;
    refresh_token: string;
}
