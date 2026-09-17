import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CheckCodeDto {
  @IsNotEmpty({ message: '_id không được để trống' })
  @ApiProperty({
    description: 'Id của đối tượng cần xác thực',
    example: '60d0fe4f5311236168a109ca',
  })
  _id!: string;

  @IsNotEmpty({ message: 'Mã xác thực không được để trống' })
  @ApiProperty({ description: 'Mã xác thực', example: '123456' })
  code!: string;
}
