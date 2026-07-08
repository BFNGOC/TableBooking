import { sendRequest } from '@/shared/utils/api';
import { uploadApiResponse } from '../types/upload-api-response';

const API_URL_PREFIX = '/upload';

export const uploadImageApi = async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);

    const res = await sendRequest<uploadApiResponse>({
        url: `${API_URL_PREFIX}/image`,
        method: 'POST',
        body: formData as unknown as { [key: string]: any },
    });

    return res.data;
};

export const uploadImagesApi = async (files: File[]) => {
    const formData = new FormData();

    files.forEach((file) => {
        formData.append('images', file);
    });

    const res = await sendRequest<uploadApiResponse[]>({
        url: `${API_URL_PREFIX}/images`,
        method: 'POST',
        body: formData as unknown as { [key: string]: any },
    });

    return res.data;
};

export const deleteImageApi = async (publicId: string) => {
    const res = await sendRequest<uploadApiResponse>({
        url: `${API_URL_PREFIX}/image`,
        method: 'DELETE',
        body: { publicId },
    });

    return res.data;
};

export const deleteImagesApi = async (publicIds: string[]) => {
    const res = await sendRequest<uploadApiResponse[]>({
        url: `${API_URL_PREFIX}/images`,
        method: 'DELETE',
        body: { publicIds },
    });

    return res.data;
};
