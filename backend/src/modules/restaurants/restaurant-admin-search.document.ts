import { RestaurantDocument } from './schemas/restaurant.schema';

export const RESTAURANT_ADMIN_SEARCH_INDEX = 'restaurants_admin';

export interface RestaurantAdminSearchDocument {
  id: string;

  restaurantName: string;

  restaurantCode: string;

  representativeName?: string;

  email?: string;

  taxCode?: string;

  address?: string;

  status: string;

  verifyStatus: string;
}

export function toRestaurantAdminSearchDocument(
  restaurant: RestaurantDocument,
): RestaurantAdminSearchDocument {
  return {
    id: restaurant.id,
    restaurantName: restaurant.restaurantName,
    restaurantCode: restaurant.restaurantCode,
    address: restaurant.address ?? '',
    representativeName: restaurant.representativeName ?? '',
    email: restaurant.email ?? '',
    taxCode: restaurant.taxCode ?? '',
    status: restaurant.status ?? '',
    verifyStatus: restaurant.verifyStatus ?? '',
  };
}
