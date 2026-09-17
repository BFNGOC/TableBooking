import { IRestaurant, RestaurantStatus, RestaurantVerifyStatus } from './restaurant.type';

export type RestaurantOnboardingPayload = {
    restaurantName: string;
    representativeName: string;
    phone: string;
    email: string;
    address: string;
    cuisineTypes: string[];
    taxCode: string;
};

export type UpdateRestaurantOnboardingPayload = Partial<RestaurantOnboardingPayload>;

export type UpdateRestaurantProfilePayload = Partial<
    Pick<
        IRestaurant,
        | 'restaurantName'
        | 'description'
        | 'cuisineTypes'
        | 'phone'
        | 'email'
        | 'address'
        | 'representativeName'
        | 'priceFrom'
        | 'priceTo'
        | 'capacity'
        | 'openingTime'
        | 'closingTime'
        | 'avatar'
        | 'images'
        | 'socialLinks'
    >
>;

export type UpdateRestaurantStatusPayload = {
    status: RestaurantStatus;
};

export type VerifyRestaurantPayload = {
    verifyStatus: RestaurantVerifyStatus;
    verifyNote?: string;
};
