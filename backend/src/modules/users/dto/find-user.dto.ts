import { IsEnum, IsOptional, IsString } from 'class-validator';
import { UserRole } from '../schemas/user.schema';
import { PaginationQueryDto } from '@app/shared/dto/pagination-query.dto';

export class FindUserDto extends PaginationQueryDto {
  //search name, email
  @IsOptional()
  @IsString()
  keySearch?: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @IsOptional()
  isActive?: boolean;
}
