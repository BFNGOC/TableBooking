import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class ChangePasswordDto {
  @IsNotEmpty({ message: 'Email không được để trống' })
  @IsEmail(
    {},
    {
      message: 'Email không đúng định dạng',
    },
  )
  email!: string;

  @IsNotEmpty({ message: 'Password không được để trống' })
  @IsString({ message: 'Password phải là một chuỗi ký tự' })
  @MinLength(6, {
    message: 'Password phải có ít nhất 6 ký tự',
  })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/, {
    message: 'Password phải chứa chữ hoa, chữ thường, số và ký tự đặc biệt',
  })
  password!: string;

  @IsNotEmpty({ message: 'Xác nhận mật khẩu không được để trống' })
  @IsString({ message: 'Xác nhận mật khẩu phải là một chuỗi ký tự' })
  @MinLength(6, {
    message: 'Xác nhận mật khẩu phải có ít nhất 6 ký tự',
  })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).+$/, {
    message:
      'Xác nhận mật khẩu phải chứa chữ hoa, chữ thường, số và ký tự đặc biệt',
  })
  confirmPassword!: string;

  @IsNotEmpty({ message: 'Mã xác thực không được để trống' })
  @IsString({ message: 'Mã xác thực phải là chuỗi ký tự' })
  code!: string;
}
