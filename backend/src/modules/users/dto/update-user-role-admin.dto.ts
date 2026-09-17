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
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserRoleAdminDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'Họ và tên', example: 'Nguyễn Văn B' })
  name?: string;

  @IsOptional()
  @IsEmail(
    {},
    {
      message: 'Email không hợp lệ',
    },
  )
  @ApiPropertyOptional({ description: 'Email', example: 'admin@example.com' })
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(6, {
    message: 'Mật khẩu tối thiểu 6 ký tự',
  })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/, {
    message: 'Mật khẩu phải chứa chữ hoa, chữ thường, số và ký tự đặc biệt',
  })
  @ApiPropertyOptional({
    description: 'Mật khẩu',
    minLength: 6,
    example: 'Admin@123',
  })
  password?: string;

  @IsOptional()
  @IsEnum(UserRole)
  @ApiPropertyOptional({ enum: UserRole, example: UserRole.ADMIN })
  role?: UserRole;

  @IsOptional()
  @IsEnum(AccountType)
  @ApiPropertyOptional({ enum: AccountType, example: AccountType.LOCAL })
  accountType?: AccountType;

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({ description: 'Is account active', example: true })
  isActive?: boolean;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'Phone number', example: '0987654321' })
  phone?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'Address',
    example: '456 Đường XYZ, Quận 3',
  })
  address?: string;

  @IsOptional()
  @ApiPropertyOptional({
    description: 'Avatar image object',
    example: { url: 'https://example.com/admin-avatar.jpg' },
  })
  avatar?: ImageType;

  @IsOptional()
  @IsEnum(Gender)
  @ApiPropertyOptional({ enum: Gender, example: Gender.FEMALE })
  gender?: Gender;

  @IsOptional()
  @IsDateString()
  @ApiPropertyOptional({
    description: 'Date of birth',
    type: String,
    example: '1985-05-05',
  })
  dateOfBirth?: Date;
}
