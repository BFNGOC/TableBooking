import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId } from 'class-validator';

export class TableParamDto {
  @ApiProperty({
    example: '687f4e91c1a7d5f8d4b4b123',
  })
  @IsMongoId()
  tableId!: string;
}
