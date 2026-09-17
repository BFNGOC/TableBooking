import { UpdateRestaurantProfilePayload } from './restaurant.dto';

export type TimeFormValue = {
    hour: number;
    minute: number;
    second?: number;
    millisecond?: number;
};

export type SocialFormValues = {
    facebook?: string;
    instagram?: string;
    tiktok?: string;
    website?: string;
};

export type RestaurantProfileFormValues = Omit<
    UpdateRestaurantProfilePayload,
    'openingTime' | 'closingTime' | 'socialLinks'
> &
    SocialFormValues & {
        openingTime?: TimeFormValue;
        closingTime?: TimeFormValue;
    };
