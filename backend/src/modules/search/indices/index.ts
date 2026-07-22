import { createRestaurantAdminIndex } from './restaurant-admin.index';
import { createUserIndex } from './user.index';

export const SEARCH_INDICES = [createUserIndex, createRestaurantAdminIndex];
