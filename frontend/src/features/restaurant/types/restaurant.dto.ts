import { ImageType } from '@/features/upload/types/image';
import {
    RestaurantStatus,
    RestaurantVerifyStatus,
    type RestaurantSocialLink,
} from './restaurant.type';

export type RestaurantOnboardingPayload = {
    restaurantName: string;
    representativeName: string;
    phone: string;
    email: string;
    address: string;
    cuisineTypes: string[];
    taxCode: string;
};

export type UpdateRestaurantBusinessPayload = Partial<RestaurantOnboardingPayload>;

export type UpdateRestaurantProfilePayload = {
    description?: string;
    openingTime?: string;
    closingTime?: string;
    priceFrom?: number;
    priceTo?: number;
    capacity?: number;
    avatar?: ImageType;
    images?: ImageType[];
    socialLinks?: RestaurantSocialLink[];
};

export type UpdateRestaurantStatusPayload = {
    status: RestaurantStatus;
};

export type VerifyRestaurantPayload = {
    verifyStatus: RestaurantVerifyStatus;
    verifyNote?: string;
};
