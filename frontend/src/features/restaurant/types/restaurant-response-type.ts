import { RestaurantStatus, RestaurantVerifyStatus } from './restaurant.type';

export interface RestaurantListAdminResponse {
    _id: string;

    restaurantCode: string;

    restaurantName: string;

    email: string;

    address: string;

    representativeName: string;

    taxCode: string;

    verifyStatus: RestaurantVerifyStatus;

    status: RestaurantStatus;

    onboardingRequestedAt: Date;
}
