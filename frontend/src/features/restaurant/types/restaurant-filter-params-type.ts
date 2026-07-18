import { FilterParams } from '@/shared/types/filter-params-type';
import { RestaurantVerifyStatus } from './restaurant.type';

export interface RestaurantFilterRoleAdminParams extends FilterParams {
    verifyStatus: RestaurantVerifyStatus;
}
