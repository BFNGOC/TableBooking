import axios from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_API_URL,
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
    try {
        const response = await api.request<IBackendRes<T>>({
            url,
            method,
            data: body,
            params: queryParams,
            headers,
            withCredentials: useCredentials,
        });

        return response.data;
    } catch (error: any) {
        if (error.response) {
            throw error.response.data;
        }

        throw {
            message: error.message,
        };
    }
};
