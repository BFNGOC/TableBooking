import { sendRequest } from '@/shared/utils/api';
import {
    ILoginResponse,
    IRegisterResponse,
    LoginPayload,
    RegisterPayload,
    RetryActivePayload,
    VerifyPayload,
} from '../types/auth.type';

export const loginApi = async (data: LoginPayload) => {
    const res = await sendRequest<ILoginResponse>({
        url: '/auth/login',
        method: 'POST',
        body: data,
    });
    return res;
};

export const registerApi = async (data: RegisterPayload) => {
    const res = await sendRequest<IRegisterResponse>({
        url: '/auth/register',
        method: 'POST',
        body: data,
    });
    return res;
};

export const verifyApi = async (data: VerifyPayload) => {
    const res = await sendRequest({
        url: '/auth/verify',
        method: 'POST',
        body: data,
    });
    return res;
};

export const retryActiveApi = async (data: RetryActivePayload) => {
    const res = await sendRequest<any>({
        url: '/auth/retry-active',
        method: 'POST',
        body: data,
    });
    return res;
};
