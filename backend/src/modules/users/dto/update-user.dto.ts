import {
  IsOptional,
  IsString,
  IsEmail,
  IsPhoneNumber,
  IsUrl,
  Length,
  IsEnum,
  IsDateString,
} from 'class-validator';

import { Gender } from '../schemas/user.schema';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserDto {
  @IsOptional()
  @IsString({ message: 'Tên phải là chuỗi' })
  @Length(2, 50, { message: 'Tên phải từ 2-50 ký tự' })
  @ApiPropertyOptional({
    description: 'Họ và tên',
    minLength: 2,
    maxLength: 50,
    example: 'Trần Thị C',
  })
  name?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Email không hợp lệ' })
  @ApiPropertyOptional({ description: 'Email', example: 'user2@example.com' })
  email?: string;

  @IsOptional()
  @IsPhoneNumber('VN', { message: 'Số điện thoại không hợp lệ' })
  @ApiPropertyOptional({ description: 'Số điện thoại', example: '0912345678' })
  phone?: string;

  @IsOptional()
  @IsString({ message: 'Địa chỉ phải là chuỗi' })
  @ApiPropertyOptional({
    description: 'Địa chỉ',
    example: '789 Đường LMN, Quận 2',
  })
  address?: string;

  @IsOptional()
  @IsUrl({}, { message: 'Avatar phải là URL hợp lệ' })
  @ApiPropertyOptional({
    description: 'Avatar URL',
    example: 'https://example.com/avatar2.jpg',
  })
  avatar?: string;

  @IsOptional()
  @IsEnum(Gender, { message: 'Giới tính không hợp lệ' })
  @ApiPropertyOptional({ enum: Gender, example: Gender.OTHER })
  gender?: Gender;

  @IsOptional()
  @IsDateString({}, { message: 'Ngày sinh không hợp lệ' })
  @ApiPropertyOptional({
    description: 'Ngày sinh',
    type: String,
    example: '1992-02-02',
  })
  dateOfBirth?: string;
}
