import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Min } from 'class-validator';

export class UpdateTablePositionDto {
  @ApiProperty({
    example: 320,
  })
  @IsNumber()
  @Min(0)
  x!: number;

  @ApiProperty({
    example: 180,
  })
  @IsNumber()
  @Min(0)
  y!: number;
}
