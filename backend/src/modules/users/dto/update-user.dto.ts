import { IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsMongoId({
    message: '_id không hợp lệ',
  })
  @IsNotEmpty({
    message: '_id không được để trống',
  })
  _id!: string;

  @IsOptional()
  @IsString()
  name?: string;
}
