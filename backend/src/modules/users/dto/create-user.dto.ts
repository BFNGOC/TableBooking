import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString({ message: 'Name phải là một chuỗi' })
  @IsNotEmpty({
    message: 'Name không được để trống',
  })
  name!: string;

  @IsEmail(
    {},
    {
      message: 'Email không đúng định dạng',
    },
  )
  email!: string;

  @IsOptional()
  @IsString()
  @MinLength(6, {
    message: 'Password phải có ít nhất 6 ký tự',
  })
  password?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  avatar?: string;
}
