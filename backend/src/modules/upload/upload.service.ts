import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { UploadApiResponse, DeleteApiResponse } from 'cloudinary';
import cloudinary, {
  configureCloudinary,
} from '../../config/cloudinary.config';

type UploadFile = {
  buffer?: Buffer;
  mimetype?: string;
  originalname?: string;
  size?: number;
};

@Injectable()
export class UploadService {
  constructor(private readonly configService: ConfigService) {
    const cloudName =
      this.configService.get<string>('CLOUDINARY_CLOUD_NAME') ??
      process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey =
      this.configService.get<string>('CLOUDINARY_API_KEY') ??
      process.env.CLOUDINARY_API_KEY;
    const apiSecret =
      this.configService.get<string>('CLOUDINARY_API_SECRET') ??
      process.env.CLOUDINARY_API_SECRET;

    configureCloudinary({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
      secure: true,
    });
  }

  private async uploadToCloudinary(file: UploadFile) {
    if (!file?.buffer?.length) {
      throw new BadRequestException('Vui lòng chọn file để upload');
    }

    try {
      const result = await new Promise<UploadApiResponse>((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              folder: process.env.CLOUDINARY_FOLDER || 'table-booking',
              resource_type: 'image',
            },
            (error, result) => {
              if (error) {
                return reject(new Error(error.message || 'Upload thất bại'));
              }

              if (!result) {
                return reject(new Error('Upload thất bại'));
              }

              resolve(result);
            },
          )
          .end(file.buffer);
      });

      return {
        url: result.secure_url,
        publicId: result.public_id,
        width: result.width,
        height: result.height,
        format: result.format,
        resourceType: result.resource_type,
      };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Upload thất bại';
      throw new InternalServerErrorException(message);
    }
  }

  async uploadImage(file: UploadFile) {
    return this.uploadToCloudinary(file);
  }

  async uploadImages(files: UploadFile[]) {
    if (!files?.length) {
      throw new BadRequestException('Vui lòng chọn ít nhất 1 file để upload');
    }

    return Promise.all(files.map((file) => this.uploadToCloudinary(file)));
  }

  async deleteImage(publicId: string) {
    await cloudinary.uploader.destroy(publicId);

    return true;
  }

  async deleteImages(publicIds: string[]) {
    if (!publicIds?.length) {
      throw new BadRequestException('Thiếu danh sách publicId');
    }

    const result = (await cloudinary.api.delete_resources(
      publicIds,
    )) as DeleteApiResponse & {
      deleted?: Record<string, unknown>;
    };

    return {
      message: 'Xóa ảnh thành công',
      deleted: result.deleted ?? {},
    };
  }
}
