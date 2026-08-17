import { createRestaurantAdminIndex } from './restaurant-admin.index';
import { createRestaurantCustomerIndex } from './restaurant-customer.index';
import { createUserIndex } from './user.index';
import { createRestaurantBookingIndex } from './booking-restaurant.index';

export const SEARCH_INDICES = [
  createUserIndex,
  createRestaurantAdminIndex,
  createRestaurantBookingIndex,
];
export const SEARCH_INDICES = [
  createUserIndex,
  createRestaurantAdminIndex,
  createRestaurantCustomerIndex,
];
