import {
  IsBoolean,
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
import { AccountType, Gender, UserRole } from '../schemas/user.schema';
import { ImageType } from '@app/modules/upload/types/image.type';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty({
    message: 'Tên không được để trống',
  })
  @ApiProperty({ description: 'Họ và tên người dùng', example: 'Nguyễn Văn A' })
  name!: string;

  @IsEmail(
    {},
    {
      message: 'Email không hợp lệ',
    },
  )
  @ApiProperty({ description: 'Email đăng nhập', example: 'user@example.com' })
  email!: string;

  @IsString()
  @MinLength(6, {
    message: 'Mật khẩu tối thiểu 6 ký tự',
  })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/, {
    message: 'Mật khẩu phải chứa chữ hoa, chữ thường, số và ký tự đặc biệt',
  })
  @ApiProperty({ description: 'Mật khẩu', minLength: 6, example: 'P@ssw0rd!' })
  password!: string;

  @IsOptional()
  @IsEnum(UserRole)
  @ApiPropertyOptional({ enum: UserRole, example: UserRole.CUSTOMER })
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
  @ApiPropertyOptional({ description: 'Phone number', example: '0123456789' })
  phone?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'Address',
    example: '123 Đường ABC, Quận 1',
  })
  address?: string;

  @IsOptional()
  @ApiPropertyOptional({
    description: 'Avatar image object',
    example: { url: 'https://example.com/avatar.jpg' },
  })
  avatar?: ImageType;

  @IsOptional()
  @IsEnum(Gender)
  @ApiPropertyOptional({ enum: Gender, example: Gender.MALE })
  gender?: Gender;

  @IsOptional()
  @IsDateString()
  @ApiPropertyOptional({
    description: 'Date of birth',
    type: String,
    example: '1990-01-01',
  })
  dateOfBirth?: Date;
}
