import { createRestaurantAdminIndex } from './restaurant-admin.index';
import { createUserIndex } from './user.index';
import { createRestaurantBookingIndex } from './booking-restaurant.index';

export const SEARCH_INDICES = [
  createUserIndex,
  createRestaurantAdminIndex,
  createRestaurantBookingIndex,
];
