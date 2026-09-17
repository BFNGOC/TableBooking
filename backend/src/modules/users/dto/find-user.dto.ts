import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from '../schemas/user.schema';
import { PaginationQueryDto } from '@app/shared/dto/pagination-query.dto';

export class FindUserDto extends PaginationQueryDto {
  //search name, email
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'Search keyword for name or email',
    example: 'john',
  })
  keySearch?: string;

  @IsOptional()
  @IsEnum(UserRole)
  @ApiPropertyOptional({ enum: UserRole, example: UserRole.CUSTOMER })
  role?: UserRole;

  @IsOptional()
  @ApiPropertyOptional({
    description: 'Filter by active status',
    example: true,
  })
  isActive?: boolean;
}
