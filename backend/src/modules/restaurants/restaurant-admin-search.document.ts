import {
  RestaurantStatus,
  RestaurantVerifyStatus,
} from './schemas/restaurant.schema';
import { RestaurantDocument } from './schemas/restaurant.schema';

export const RESTAURANT_ADMIN_SEARCH_INDEX = 'restaurants_admin';

export interface RestaurantAdminSearchDocument {
  restaurantName: string;

  restaurantCode: string;

  representativeName?: string;

  email?: string;

  taxCode?: string;

  address?: string;

  status?: RestaurantStatus;

  verifyStatus?: RestaurantVerifyStatus;

  onboardingRequestedAt?: Date;
}

export function toRestaurantAdminSearchDocument(
  restaurant: RestaurantDocument,
): RestaurantAdminSearchDocument {
  return {
    restaurantName: restaurant.restaurantName,

    restaurantCode: restaurant.restaurantCode,

    representativeName: restaurant.representativeName,

    email: restaurant.email,

    taxCode: restaurant.taxCode,

    address: restaurant.address,

    status: restaurant.status,

    verifyStatus: restaurant.verifyStatus,

    onboardingRequestedAt: restaurant.onboardingRequestedAt,
  };
}
