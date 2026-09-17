import { RestaurantVerifyStatus } from '../schemas/restaurant.schema';

export interface VerifyStatusCountAggregate {
  _id: RestaurantVerifyStatus;

  count: number;
}
