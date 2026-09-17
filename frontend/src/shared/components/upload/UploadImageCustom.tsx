'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { Button, Label, Spinner } from '@heroui/react';
import { ImagePlus, Trash2 } from 'lucide-react';

import { FormField } from '@/shared/types/form-field';
import { ImageType } from '@/features/upload/types/image';

import { useUploadImage } from '@/features/upload/hook/useUploadImage';
import { useUploadImages } from '@/features/upload/hook/useUploadImages';

import { useDeleteImage } from '@/features/upload/hook/useDeleteImage';

function UploadImageCustom({
    label,
    isDisabled,
    value,
    onChange,
    multiple,
    maxFiles = 10,
    onLoadingChange,
}: FormField) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const uploadMutation = useUploadImage();
    const uploadsMutation = useUploadImages();

    const deleteMutation = useDeleteImage();

    const images: ImageType[] = Array.isArray(value) ? value : value ? [value] : [];

    const chooseImage = () => {
        if (isDisabled) return;

        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files ?? []);

        if (!files.length) return;

        if (multiple) {
            uploadsMutation.mutate(files, {
                onSuccess: (uploadedImages) => {
                    onChange?.([...images, ...uploadedImages]);
                },
            });
        } else {
            uploadMutation.mutate(files[0], {
                onSuccess: (uploadedImage) => {
                    onChange?.(uploadedImage);
                },
            });
        }

        event.target.value = '';
    };

    const handleDelete = (image: ImageType) => {
        deleteMutation.mutate(image.publicId, {
            onSuccess: () => {
                if (multiple) {
                    onChange?.(images.filter((item) => item.publicId !== image.publicId));
                } else {
                    onChange?.(null);
                }
            },
        });
    };

    const isLoading =
        uploadMutation.isPending || uploadsMutation.isPending || deleteMutation.isPending;

    useEffect(() => {
        onLoadingChange?.(isLoading);
    }, [isLoading, onLoadingChange]);

    return (
        <div className="flex flex-col gap-2">
            {label && <Label className="text-sm font-medium">{label}</Label>}

            <input
                hidden
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple={multiple}
                onChange={handleFileChange}
            />

            <div className="flex flex-wrap gap-4">
                {images.map((image) => (
                    <div
                        key={image.publicId}
                        className="relative h-44 w-44 overflow-hidden rounded-xl border"
                    >
                        <Image src={image.url} alt="" fill className="object-cover" />

                        {!isDisabled && (
                            <Button
                                isIconOnly
                                size="sm"
                                variant="danger"
                                className="absolute right-2 top-2 z-10"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDelete(image);
                                }}
                            >
                                <Trash2 size={16} />
                            </Button>
                        )}
                    </div>
                ))}

                {(!multiple || images.length < maxFiles) && (
                    <div
                        onClick={chooseImage}
                        className="
                            flex
                            h-44
                            w-44
                            cursor-pointer
                            items-center
                            justify-center
                            rounded-xl
                            border-2
                            border-dashed
                            transition
                            hover:border-primary
                        "
                    >
                        {isLoading ? (
                            <Spinner />
                        ) : (
                            <div className="flex flex-col items-center gap-2 text-default-500">
                                <ImagePlus size={42} />
                                <span className="text-sm">Chọn ảnh</span>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default UploadImageCustom;
