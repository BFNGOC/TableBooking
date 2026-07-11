import { IsEmail, IsOptional, IsString } from 'class-validator';

export class GoogleLoginDto {
  @IsEmail()
  email!: string;

  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  avatar?: string;

  @IsOptional()
  @IsString()
  providerId?: string;
}
