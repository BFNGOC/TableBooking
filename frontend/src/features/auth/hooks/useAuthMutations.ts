import { useMutation } from '@tanstack/react-query';
import { loginApi, registerApi, verifyApi } from '../api/auth-api';
import { LoginPayload, RegisterPayload, VerifyPayload } from '../types/auth.type';

export const useLoginMutation = () =>
    useMutation({
        mutationFn: (payload: LoginPayload) => loginApi(payload),
    });

export const useRegisterMutation = () =>
    useMutation({
        mutationFn: (payload: RegisterPayload) => registerApi(payload),
    });

export const useVerifyMutation = () =>
    useMutation({
        mutationFn: (payload: VerifyPayload) => verifyApi(payload),
    });
