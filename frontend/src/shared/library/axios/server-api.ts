import { auth } from '@/auth';
import { sendRequest } from './api';

export async function serverRequest<T>(request: IRequest) {
    const session = await auth();

    return sendRequest<T>({
        baseURL: process.env.BACKEND_API_URL,
        ...request,
        accessToken: (session?.user as any)?.accessToken,
    });
}
