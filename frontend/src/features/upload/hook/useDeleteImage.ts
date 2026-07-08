import { useMutation } from '@tanstack/react-query';
import { deleteImageApi } from '../api/upload-api';

export function useDeleteImage() {
    return useMutation({
        mutationFn: deleteImageApi,
    });
}
