import { useMutation } from '@tanstack/react-query';
import { uploadImagesApi } from '../api/upload-api';

export function useUploadImages() {
    return useMutation({
        mutationFn: uploadImagesApi,
    });
}
