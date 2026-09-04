import axios from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_API_URL,
    withCredentials: true,
});

export const sanitizeQueryParams = <T extends Record<string, any>>(
    queryParams?: T,
    defaultValues?: Partial<T>
) => {
    if (!queryParams || typeof queryParams !== 'object') {
        return undefined;
    }

    const sanitized = Object.entries(queryParams).reduce<Partial<T>>((acc, [key, value]) => {
        if (value === undefined || value === null) {
            return acc;
        }

        if (typeof value === 'string' && value.trim() === '') {
            return acc;
        }

        if (
            defaultValues &&
            Object.prototype.hasOwnProperty.call(defaultValues, key) &&
            value === defaultValues[key as keyof T]
        ) {
            return acc;
        }

        acc[key as keyof T] = value as T[keyof T];

        return acc;
    }, {});

    return Object.keys(sanitized).length > 0 ? (sanitized as T) : undefined;
};

export const sendRequest = async <T>({
    url,
    method,
    body,
    queryParams,
    headers,
    useCredentials = true,
    accessToken,
    baseURL,
}: IRequest): Promise<IBackendRes<T>> => {
    try {
        const preparedQueryParams = sanitizeQueryParams(queryParams);

        const response = await api.request<IBackendRes<T>>({
            baseURL,
            url,
            method,
            data: body,
            params: preparedQueryParams,
            withCredentials: useCredentials,
            headers: {
                ...headers,
                ...(accessToken && {
                    Authorization: `Bearer ${accessToken}`,
                }),
            },
        });

        return response.data;
    } catch (error: any) {
        if (error.response) throw error.response.data;

        throw {
            message: error.message,
        };
    }
};
