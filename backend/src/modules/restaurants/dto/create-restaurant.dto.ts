import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RestaurantOnboardingDto {
  @ApiProperty({
    example: 'Le Gourmet',
  })
  @IsString()
  @IsNotEmpty()
  restaurantName!: string;

  @ApiProperty({
    example: 'Nguyễn Văn A',
  })
  @IsString()
  @IsNotEmpty()
  representativeName!: string;

  @ApiProperty({
    example: '0987654321',
  })
  @Matches(/^[0-9]{9,11}$/)
  phone!: string;

  @ApiProperty({
    example: 'restaurant@gmail.com',
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    example: '123 Nguyễn Huệ, Quận 1, TP.HCM',
  })
  @IsString()
  @IsNotEmpty()
  address!: string;

  @ApiProperty({
    example: ['BBQ', 'Hải sản'],
  })
  @IsArray()
  @IsString({ each: true })
  cuisineTypes!: string[];

  @ApiProperty({
    example: '0312345678',
  })
  @IsString()
  @IsNotEmpty()
  taxCode!: string;
}
