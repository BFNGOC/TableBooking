import { useMutation } from '@tanstack/react-query';
import { uploadImageApi } from '../api/upload-api';

export function useUploadImage() {
    return useMutation({
        mutationFn: uploadImageApi,
    });
}
