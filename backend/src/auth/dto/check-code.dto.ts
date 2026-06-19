import { IsNotEmpty } from 'class-validator';

export class CheckCodeDto {
  @IsNotEmpty({ message: '_id không được để trống' })
  _id!: string;

  @IsNotEmpty({ message: 'Mã xác thực không được để trống' })
  code!: string;
}
