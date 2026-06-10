import axios from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    withCredentials: true,
});

export const sendRequest = async <T>({
    url,
    method,
    body,
    queryParams,
    headers,
    useCredentials = true,
}: IRequest): Promise<IBackendRes<T>> => {
    const response = await api.request<IBackendRes<T>>({
        url,
        method,
        data: body,
        params: queryParams,
        headers,
        withCredentials: useCredentials,
    });

    return response.data;
};
