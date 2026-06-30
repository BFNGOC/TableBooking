import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
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
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/, {
    message: 'Password phải chứa chữ hoa, chữ thường, số và ký tự đặc biệt',
  })
  password?: string;
}
