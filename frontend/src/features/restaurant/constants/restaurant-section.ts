import { FormSection } from '@/shared/components/modals/ModalFormTabs';
import {
    onboardingFormField,
    restaurantProfileFormField,
    userProfileFormField,
} from './restaurant-admin-section-form-field';
import { RestaurantVerifyStatus } from '../types/restaurant.type';
import { options } from '@/shared/types/form-field';

export const restaurantSections = (cuisineOptions?: options[]): FormSection[] => [
    {
        key: 'onboarding',
        title: 'Thông tin nhà hàng đăng ký',
        fields: onboardingFormField,
    },
    {
        key: 'restaurantProfile',
        title: 'Thông tin nhà hàng đăng ký',
        fields: restaurantProfileFormField(cuisineOptions ?? []),
        hidden: ({ dataForm }) => {
            return dataForm.verifyStatus !== RestaurantVerifyStatus.APPROVED;
        },
    },
    {
        key: 'user',
        title: 'Thông tin tài khoản đăng ký',
        fields: userProfileFormField,
    },
];
