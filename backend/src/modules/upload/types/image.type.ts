import { Prop } from '@nestjs/mongoose';

export class ImageType {
  @Prop({
    required: true,
  })
  url!: string;

  @Prop({
    required: true,
  })
  publicId!: string;
}
