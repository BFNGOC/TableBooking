import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId } from 'class-validator';

export class FindTablesDto {
  @ApiProperty({
    example: '687f4e91c1a7d5f8d4b4b123',
  })
  @IsMongoId()
  areaId!: string;
}
