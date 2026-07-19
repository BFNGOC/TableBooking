import { IRestaurant, RestaurantStatus, RestaurantVerifyStatus } from './restaurant.type';

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

export interface VerifyStatusCount {
    total: number;

    emailPending: number;

    pending: number;

    approved: number;

    rejected: number;
}

export interface RestaurantUserInfo {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    avatar?: string;
}

export interface RestaurantOnboardingDetail {
    _id: string;

    restaurantCode: string;

    restaurantName: string;

    status: RestaurantStatus;

    verifyStatus: RestaurantVerifyStatus;

    verifyNote?: string;

    taxCode?: string;

    representativeName?: string;

    address?: string;

    email?: string;

    phone?: string;

    onboardingRequestedAt?: Date;

    user?: RestaurantUserInfo;
}

export interface RestaurantDetail extends IRestaurant {
    user?: RestaurantUserInfo;
}

export interface RestaurantAdminDetailResponse {
    type: 'ONBOARDING' | 'RESTAURANT';

    data: RestaurantOnboardingDetail | RestaurantDetail;
}
