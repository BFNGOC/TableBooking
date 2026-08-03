import { createRestaurantAdminIndex } from './restaurant-admin.index';
import { createRestaurantCustomerIndex } from './restaurant-customer.index';
import { createUserIndex } from './user.index';

export const SEARCH_INDICES = [
  createUserIndex,
  createRestaurantAdminIndex,
  createRestaurantCustomerIndex,
];
