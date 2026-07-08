import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class PaginationQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @ApiPropertyOptional({
    description: 'Current page number',
    default: 1,
    example: 1,
  })
  currentPage: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @ApiPropertyOptional({
    description: 'Number of items per page',
    default: 10,
    example: 10,
  })
  pageSize: number = 10;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'Sort string, e.g. "field:ASC" or "field:DESC"',
    example: 'name:ASC',
  })
  sort?: string;
}
