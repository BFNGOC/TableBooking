import { ImageType } from '../upload/types/image.type';
import {
  RestaurantDocument,
  RestaurantStatus,
  RestaurantVerifyStatus,
} from './schemas/restaurant.schema';

export const RESTAURANT_CUSTOMER_SEARCH_INDEX = 'restaurants_customer';

export interface RestaurantCustomerSearchDocument {
  restaurantName: string;

  address?: string;

  avatar?: ImageType;

  cuisineTypes?: string[];

  rating?: number;

  priceFrom?: number;

  priceTo?: number;

  capacity?: number;

  status?: RestaurantStatus;

  verifyStatus?: RestaurantVerifyStatus;

  isAcceptingBookings?: boolean;

  slug?: string;
}

export function toRestaurantCustomerSearchDocument(
  restaurant: RestaurantDocument,
): RestaurantCustomerSearchDocument {
  return {
    restaurantName: restaurant.restaurantName,

    address: restaurant.address,

    avatar: restaurant.avatar,

    cuisineTypes: restaurant.cuisineTypes,

    rating: restaurant.rating,

    priceFrom: restaurant.priceFrom,

    priceTo: restaurant.priceTo,

    capacity: restaurant.capacity,

    status: restaurant.status,

    verifyStatus: restaurant.verifyStatus,

    isAcceptingBookings: restaurant.isAcceptingBookings,

    slug: restaurant.slug,
  };
}
