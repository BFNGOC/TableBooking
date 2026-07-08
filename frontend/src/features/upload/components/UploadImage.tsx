'use client';

import { useEffect, useRef, useState, type ChangeEvent } from 'react';
import Image from 'next/image';
import { Button, Card } from '@heroui/react';
import { ImagePlus, Trash2 } from 'lucide-react';

import { ImageType } from '@/features/upload/types/image';
import { useToast } from '@/shared/hooks/useToast';

export interface UploadImageProps {
    label?: string;
    value?: ImageType | ImageType[] | null;
    onChange?: (value: ImageType | ImageType[] | null) => void;
    onUpload: (files: File | File[]) => Promise<ImageType | ImageType[]>;
    disabled?: boolean;
    required?: boolean;
    multiple?: boolean;
    shape?: 'square' | 'circle';
    size?: number;
    accept?: string;
    maxSize?: number;
    maxFiles?: number;
    onDelete?: (image: ImageType) => Promise<void> | void;
}

export default function UploadImage({
    label,
    value,
    onChange,
    onUpload,
    disabled = false,
    required = false,
    multiple = false,
    shape = 'square',
    size = 180,
    accept = 'image/*',
    maxSize = 5,
    maxFiles = 10,
    onDelete,
}: UploadImageProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [loading, setLoading] = useState(false);
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);
    const { showToast } = useToast();

    useEffect(() => {
        return () => {
            previewUrls.forEach((url) => URL.revokeObjectURL(url));
        };
    }, [previewUrls]);

    const chooseFile = () => {
        if (disabled) return;

        inputRef.current?.click();
    };

    const revokePreviewUrls = (urls: string[]) => {
        urls.forEach((url) => URL.revokeObjectURL(url));
    };

    const isAllowedMimeType = (file: File, accepted: string | undefined) => {
        if (!accepted || accepted === '*/*') return true;

        const allowedPatterns = accepted
            .split(',')
            .map((item) => item.trim())
            .filter(Boolean);

        return allowedPatterns.some((pattern) => {
            const normalizedPattern = pattern.toLowerCase();

            if (normalizedPattern.startsWith('.')) {
                return file.name.toLowerCase().endsWith(normalizedPattern);
            }

            if (normalizedPattern.endsWith('/*')) {
                return file.type.startsWith(normalizedPattern.slice(0, -1));
            }

            return file.type === normalizedPattern;
        });
    };

    const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = Array.from(e.target.files ?? []);

        if (!selectedFiles.length) return;

        const currentImages = Array.isArray(value) ? value : value ? [value] : [];
        const filesToUpload = multiple
            ? selectedFiles.slice(0, Math.max(0, maxFiles - currentImages.length))
            : selectedFiles.slice(0, 1);

        if (!filesToUpload.length) {
            showToast(
                'warning',
                'Không thể upload thêm ảnh',
                `Bạn đã đạt giới hạn ${maxFiles} ảnh`
            );
            e.target.value = '';
            return;
        }

        if (multiple && selectedFiles.length > filesToUpload.length) {
            showToast('warning', 'Vượt quá số lượng ảnh cho phép', `Tối đa ${maxFiles} ảnh`);
        }

        const invalidMimeTypeFiles = filesToUpload.filter(
            (file) => !isAllowedMimeType(file, accept)
        );

        if (invalidMimeTypeFiles.length) {
            showToast('error', 'File không hợp lệ', 'Vui lòng chọn đúng định dạng ảnh');
            e.target.value = '';
            return;
        }

        const oversizedFiles = filesToUpload.filter((file) => file.size > maxSize * 1024 * 1024);

        if (oversizedFiles.length) {
            showToast('error', 'File quá lớn', `Dung lượng tối đa ${maxSize}MB`);
            e.target.value = '';
            return;
        }

        const nextPreviewUrls = filesToUpload.map((file) => URL.createObjectURL(file));
        revokePreviewUrls(previewUrls);
        setPreviewUrls(nextPreviewUrls);

        try {
            setLoading(true);

            const uploadPayload = multiple ? filesToUpload : filesToUpload[0];
            const result = await onUpload(uploadPayload);
            const uploadedImages = Array.isArray(result) ? result : [result];

            if (multiple) {
                const currentImages = Array.isArray(value) ? value : value ? [value] : [];
                onChange?.([...currentImages, ...uploadedImages]);
            } else {
                onChange?.(uploadedImages[0] ?? null);
            }
        } catch (error) {
            console.error('Upload failed', error);
            showToast('error', 'Upload thất bại', 'Không thể tải ảnh lên');
        } finally {
            setLoading(false);
            revokePreviewUrls(nextPreviewUrls);
            setPreviewUrls([]);
            e.target.value = '';
        }
    };

    const currentImages = Array.isArray(value) ? value : value ? [value] : [];
    const displayImages =
        loading && previewUrls.length > 0
            ? previewUrls.map((url) => ({ url, publicId: '' }))
            : currentImages;

    const removeImage = async (index: number) => {
        const imageToDelete = currentImages[index];

        if (!imageToDelete) return;

        if (onDelete && imageToDelete.publicId) {
            try {
                await onDelete(imageToDelete);
            } catch (error) {
                console.error('Delete failed', error);
                showToast('error', 'Xóa ảnh thất bại', 'Không thể xóa ảnh trên Cloudinary');
                return;
            }
        }

        if (multiple) {
            const nextImages = currentImages.filter((_, itemIndex) => itemIndex !== index);
            onChange?.(nextImages.length ? nextImages : null);
        } else {
            onChange?.(null);
        }

        showToast('success', 'Xóa ảnh thành công');
    };

    return (
        <div className="flex flex-col gap-3">
            {label && (
                <label className="text-sm font-medium">
                    {label}
                    {required && <span className="text-danger ml-1">*</span>}
                </label>
            )}

            <input
                hidden
                ref={inputRef}
                type="file"
                accept={accept}
                multiple={multiple}
                onChange={handleFileChange}
            />

            <Card
                className="w-full cursor-pointer border-2 border-dashed shadow-none"
                style={{ width: multiple ? '100%' : size, minHeight: size }}
                role="button"
                tabIndex={0}
                onClick={chooseFile}
                onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        chooseFile();
                    }
                }}
            >
                <div className="flex w-full flex-wrap items-center justify-center gap-3 p-3">
                    {loading && previewUrls.length > 0 ? (
                        previewUrls.map((url, index) => (
                            <div
                                key={`${url}-${index}`}
                                className="relative overflow-hidden"
                                style={{
                                    width: size - 20,
                                    height: size - 20,
                                }}
                            >
                                <Image
                                    fill
                                    src={url}
                                    alt="preview"
                                    className={`object-cover ${shape === 'circle' ? 'rounded-full' : 'rounded-xl'}`}
                                />
                            </div>
                        ))
                    ) : displayImages.length > 0 ? (
                        displayImages.map((image, index) => (
                            <div
                                key={`${image.publicId || image.url}-${index}`}
                                className="relative overflow-hidden"
                                style={{
                                    width: size - 20,
                                    height: size - 20,
                                }}
                            >
                                <Image
                                    fill
                                    src={image.url}
                                    alt="preview"
                                    className={`object-cover ${shape === 'circle' ? 'rounded-full' : 'rounded-xl'}`}
                                />

                                {!disabled && (
                                    <button
                                        type="button"
                                        onClick={(event) => {
                                            event.stopPropagation();
                                            void removeImage(index);
                                        }}
                                        className="absolute top-2 right-2 rounded-full bg-red-500 p-1 text-white"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                )}
                            </div>
                        ))
                    ) : (
                        <ImagePlus size={50} className="text-default-400" />
                    )}
                </div>
            </Card>

            {!disabled && currentImages.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    <Button variant="danger-soft" onPress={() => onChange?.(null)}>
                        <Trash2 size={16} />
                        Xóa
                    </Button>
                </div>
            )}
        </div>
    );
}
