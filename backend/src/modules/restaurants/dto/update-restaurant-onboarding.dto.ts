import { PartialType } from '@nestjs/swagger';
import { RestaurantOnboardingDto } from './create-restaurant.dto';

export class UpdateRestaurantOnboardingDto extends PartialType(
  RestaurantOnboardingDto,
) {}
