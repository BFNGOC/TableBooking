import { getSession } from 'next-auth/react';
import { sendRequest } from './api';

export async function clientRequest<T>(request: IRequest) {
    const session = await getSession();

    return sendRequest<T>({
        ...request,
        accessToken: (session?.user as any)?.accessToken,
    });
}
