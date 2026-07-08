import {
  IsOptional,
  IsString,
  IsEmail,
  IsEnum,
  IsDateString,
  IsBoolean,
  Matches,
  MinLength,
} from 'class-validator';

import { AccountType, Gender, UserRole } from '../schemas/user.schema';
import { ImageType } from '@app/modules/upload/types/image.type';

export class UpdateUserRoleAdminDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEmail(
    {},
    {
      message: 'Email không hợp lệ',
    },
  )
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(6, {
    message: 'Mật khẩu tối thiểu 6 ký tự',
  })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/, {
    message: 'Mật khẩu phải chứa chữ hoa, chữ thường, số và ký tự đặc biệt',
  })
  password?: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @IsOptional()
  @IsEnum(AccountType)
  accountType?: AccountType;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  avatar?: ImageType;

  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  @IsOptional()
  @IsDateString()
  dateOfBirth?: Date;
}
