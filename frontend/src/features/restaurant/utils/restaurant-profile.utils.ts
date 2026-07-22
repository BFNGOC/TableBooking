/**
 * ============================================================
 * SOCIAL LINKS
 * ============================================================
 */

import {
    RestaurantProfileFormValues,
    SocialFormValues,
    TimeFormValue,
} from '../types/restaurant-profile.types';
import { UpdateRestaurantProfilePayload } from '../types/restaurant.dto';
import { SocialLinkType } from '../types/restaurant.type';

/**
 * BE -> FORM
 *
 * [
 *   {
 *     type: 'FACEBOOK',
 *     url: 'https://facebook.com/...'
 *   }
 * ]
 *
 * ->
 *
 * {
 *   facebook: 'https://facebook.com/...'
 * }
 */
export const socialLinksToFormValues = (
    socialLinks?: UpdateRestaurantProfilePayload['socialLinks']
): SocialFormValues => {
    return {
        facebook: socialLinks?.find((item) => item.type === SocialLinkType.FACEBOOK)?.url ?? '',

        instagram: socialLinks?.find((item) => item.type === SocialLinkType.INSTAGRAM)?.url ?? '',

        tiktok: socialLinks?.find((item) => item.type === SocialLinkType.TIKTOK)?.url ?? '',

        website: socialLinks?.find((item) => item.type === SocialLinkType.WEBSITE)?.url ?? '',
    };
};

/**
 * FORM -> BE
 */
export const formValuesToSocialLinks = ({
    facebook,
    instagram,
    tiktok,
    website,
}: SocialFormValues): NonNullable<UpdateRestaurantProfilePayload['socialLinks']> => {
    const socialLinks = [
        {
            type: SocialLinkType.FACEBOOK,
            url: facebook?.trim(),
        },
        {
            type: SocialLinkType.INSTAGRAM,
            url: instagram?.trim(),
        },
        {
            type: SocialLinkType.TIKTOK,
            url: tiktok?.trim(),
        },
        {
            type: SocialLinkType.WEBSITE,
            url: website?.trim(),
        },
    ];

    return socialLinks
        .filter(
            (
                item
            ): item is {
                type: SocialLinkType;
                url: string;
            } => Boolean(item.url)
        )
        .map((item) => ({
            type: item.type,
            url: item.url,
        }));
};

/**
 * ============================================================
 * TIME
 * ============================================================
 */

/**
 * BE -> FORM
 *
 * "08:30"
 *
 * ->
 *
 * {
 *   hour: 8,
 *   minute: 30
 * }
 */
export const timeStringToFormValue = (value?: string): TimeFormValue | undefined => {
    if (!value) return undefined;

    const [hour, minute] = value.split(':').map(Number);

    if (Number.isNaN(hour) || Number.isNaN(minute)) {
        return undefined;
    }

    return {
        hour,
        minute,
        second: 0,
        millisecond: 0,
    };
};

/**
 * FORM -> BE
 *
 * {
 *   hour: 8,
 *   minute: 30
 * }
 *
 * ->
 *
 * "08:30"
 */
export const timeFormValueToString = (value?: TimeFormValue): string | undefined => {
    if (!value) return undefined;

    return `${String(value.hour).padStart(2, '0')}:${String(value.minute).padStart(2, '0')}`;
};

/**
 * ============================================================
 * RESTAURANT -> FORM
 * ============================================================
 */

export const restaurantToFormValues = (restaurant: any): RestaurantProfileFormValues => {
    return {
        restaurantName: restaurant.restaurantName,
        description: restaurant.description,
        cuisineTypes: restaurant.cuisineTypes,

        phone: restaurant.phone,
        email: restaurant.email,
        address: restaurant.address,
        representativeName: restaurant.representativeName,

        priceFrom: restaurant.priceFrom,
        priceTo: restaurant.priceTo,
        capacity: restaurant.capacity,

        openingTime: timeStringToFormValue(restaurant.openingTime),
        closingTime: timeStringToFormValue(restaurant.closingTime),

        avatar: restaurant.avatar,
        images: restaurant.images,

        ...socialLinksToFormValues(restaurant.socialLinks),
    };
};

/**
 * ============================================================
 * NORMALIZE
 * ============================================================
 *
 * Dùng để so sánh FORM hiện tại với FORM ban đầu.
 *
 * Mục đích:
 *
 * undefined / null / ''
 * được xử lý nhất quán.
 *
 * Social links được sort.
 *
 * Cuisine types được sort.
 */

const normalizeValues = (values: RestaurantProfileFormValues) => {
    return {
        restaurantName: values.restaurantName?.trim() ?? '',

        description: values.description?.trim() ?? '',

        cuisineTypes: [...(values.cuisineTypes ?? [])].sort(),

        phone: values.phone?.trim() ?? '',

        email: values.email?.trim() ?? '',

        address: values.address?.trim() ?? '',

        representativeName: values.representativeName?.trim() ?? '',

        priceFrom: values.priceFrom ?? null,

        priceTo: values.priceTo ?? null,

        capacity: values.capacity ?? null,

        openingTime: timeFormValueToString(values.openingTime) ?? '',

        closingTime: timeFormValueToString(values.closingTime) ?? '',

        avatar: values.avatar
            ? {
                  url: values.avatar.url,
                  publicId: values.avatar.publicId,
              }
            : null,

        images: (values.images ?? []).map((image) => ({
            url: image.url,
            publicId: image.publicId,
        })),

        socialLinks: formValuesToSocialLinks({
            facebook: values.facebook,
            instagram: values.instagram,
            tiktok: values.tiktok,
            website: values.website,
        }).sort((a, b) => a.type.localeCompare(b.type)),
    };
};

/**
 * ============================================================
 * CHECK CHANGED
 * ============================================================
 */

export const isRestaurantProfileChanged = (
    current: RestaurantProfileFormValues,
    initial: RestaurantProfileFormValues
): boolean => {
    return JSON.stringify(normalizeValues(current)) !== JSON.stringify(normalizeValues(initial));
};
