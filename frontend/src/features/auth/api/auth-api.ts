import { sendRequest } from '@/shared/utils/api';
import { ILoginResponse, LoginPayload } from '../types/auth.type';

export const loginApi = async (data: LoginPayload) => {
    const res = await sendRequest<ILoginResponse>({
        url: '/auth/login',
        method: 'POST',
        body: data,
    });
    return res;
};
