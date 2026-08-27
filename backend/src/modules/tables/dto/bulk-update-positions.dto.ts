import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsMongoId,
  IsNumber,
  Min,
  ValidateNested,
} from 'class-validator';

export class TablePositionItemDto {
  @ApiProperty({ example: '665f1a2b3c4d5e6f7a8b9c0d' })
  @IsMongoId()
  tableId!: string;

  @ApiProperty({ example: 320 })
  @IsNumber()
  @Min(0)
  x!: number;

  @ApiProperty({ example: 180 })
  @IsNumber()
  @Min(0)
  y!: number;
}

export class BulkUpdatePositionsDto {
  @ApiProperty({ type: [TablePositionItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TablePositionItemDto)
  positions!: TablePositionItemDto[];
}
