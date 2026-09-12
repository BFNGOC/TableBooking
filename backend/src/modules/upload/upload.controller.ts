import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { Throttle } from '@nestjs/throttler';
import { Roles } from '@app/decorator/roles.decorator';
import { UserRole } from '../users/schemas/user.schema';

import { UploadService } from './upload.service';
import { ResponseMessage } from '@app/decorator/customize';

type UploadFile = {
  buffer?: Buffer;
  mimetype?: string;
  originalname?: string;
  size?: number;
};

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('image')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @UseInterceptors(
    FileInterceptor('image', {
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
      },
      fileFilter: (req, file, callback) => {
        if (!file.mimetype.startsWith('image/')) {
          return callback(
            new BadRequestException('Chỉ được upload file hình ảnh'),
            false,
          );
        }

        callback(null, true);
      },
    }),
  )
  @ResponseMessage('Thêm hình ảnh thành công')
  uploadImage(@UploadedFile() image: UploadFile) {
    if (!image) {
      throw new BadRequestException('Thiếu ảnh upload');
    }

    return this.uploadService.uploadImage(image);
  }

  @Post('images')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @UseInterceptors(
    FilesInterceptor('images', 10, {
      limits: {
        fileSize: 5 * 1024 * 1024,
      },
      fileFilter: (req, file, callback) => {
        if (!file.mimetype.startsWith('image/')) {
          return callback(
            new BadRequestException('Chỉ được upload file hình ảnh'),
            false,
          );
        }

        callback(null, true);
      },
    }),
  )
  @ResponseMessage('Thêm các hình ảnh thành công')
  uploadImages(@UploadedFiles() images: UploadFile[]) {
    if (!images?.length) {
      throw new BadRequestException('Thiếu ảnh upload');
    }

    return this.uploadService.uploadImages(images);
  }

  @Delete('image')
  @Roles(UserRole.ADMIN)
  @ResponseMessage('Xóa hình ảnh thành công')
  deleteImage(@Body('publicId') publicId: string) {
    return this.uploadService.deleteImage(publicId);
  }

  @Delete('images')
  @Roles(UserRole.ADMIN)
  @ResponseMessage('Xóa các hình ảnh thành công')
  deleteImages(@Body('publicIds') publicIds: string[]) {
    return this.uploadService.deleteImages(publicIds);
  }
}
