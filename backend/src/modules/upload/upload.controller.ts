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
  @UseInterceptors(FileInterceptor('image'))
  @ResponseMessage('Thêm hình ảnh thành công')
  uploadImage(@UploadedFile() image: UploadFile) {
    if (!image) {
      throw new BadRequestException('Thiếu ảnh upload');
    }

    return this.uploadService.uploadImage(image);
  }

  @Post('images')
  @UseInterceptors(FilesInterceptor('images', 10))
  @ResponseMessage('Thêm các hình ảnh thành công')
  uploadImages(@UploadedFiles() images: UploadFile[]) {
    if (!images?.length) {
      throw new BadRequestException('Thiếu ảnh upload');
    }

    return this.uploadService.uploadImages(images);
  }

  @Delete('image')
  @ResponseMessage('Xóa hình ảnh thành công')
  deleteImage(@Body('publicId') publicId: string) {
    return this.uploadService.deleteImage(publicId);
  }

  @Delete('images')
  @ResponseMessage('Xóa các hình ảnh thành công')
  deleteImages(@Body('publicIds') publicIds: string[]) {
    return this.uploadService.deleteImages(publicIds);
  }
}
