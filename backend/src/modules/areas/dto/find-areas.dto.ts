import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty } from 'class-validator';

export class FindAreasDto {
  @ApiProperty({
    example: '687f4e91c1a7d5f8d4b4b123',
    description: 'ID của nhà hàng',
  })
  @IsMongoId()
  @IsNotEmpty()
  restaurantId!: string;
}
