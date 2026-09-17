import { Optional } from '@nestjs/common';
import {
  IsNotEmpty,
  IsEmail,
  MinLength,
  IsString,
  Matches,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAuthDto {
  @IsNotEmpty({ message: 'Email không được để trống' })
  @IsEmail(
    {},
    {
      message: 'Email không đúng định dạng',
    },
  )
  @ApiProperty({ description: 'Email đăng ký', example: 'auth@example.com' })
  email!: string;

  @IsNotEmpty({ message: 'Password không được để trống' })
  @IsString({ message: 'Password phải là một chuỗi ký tự' })
  @MinLength(6, {
    message: 'Password phải có ít nhất 6 ký tự',
  })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/, {
    message: 'Password phải chứa chữ hoa, chữ thường, số và ký tự đặc biệt',
  })
  @ApiProperty({ description: 'Mật khẩu', minLength: 6, example: 'AuthP@ss1' })
  password!: string;

  @IsString({ message: 'Name phải là một chuỗi' })
  @Optional()
  @ApiPropertyOptional({ description: 'Họ và tên', example: 'Lê Văn D' })
  name?: string;
}
