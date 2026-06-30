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

export class UpdateUserDto {
  @IsOptional()
  @IsString({ message: 'Tên phải là chuỗi' })
  @Length(2, 50, { message: 'Tên phải từ 2-50 ký tự' })
  name?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Email không hợp lệ' })
  email?: string;

  @IsOptional()
  @IsPhoneNumber('VN', { message: 'Số điện thoại không hợp lệ' })
  phone?: string;

  @IsOptional()
  @IsString({ message: 'Địa chỉ phải là chuỗi' })
  address?: string;

  @IsOptional()
  @IsUrl({}, { message: 'Avatar phải là URL hợp lệ' })
  avatar?: string;

  @IsOptional()
  @IsEnum(Gender, { message: 'Giới tính không hợp lệ' })
  gender?: Gender;

  @IsOptional()
  @IsDateString({}, { message: 'Ngày sinh không hợp lệ' })
  dateOfBirth?: string;
}
