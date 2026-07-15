import { getRestaurantMeServerApi } from '@/features/restaurant/api/restaurant-server-api';
import VerifyEmailOnboardingPage from '@/features/restaurant/pages/VerifyEmailOnboardingPage';
import { RestaurantVerifyStatus } from '@/features/restaurant/types/restaurant.type';
import { redirectToCorrectPage } from '@/features/restaurant/utils/redirectOnboardingPage';
import { redirect } from 'next/navigation';

type Props = {
    params: Promise<{
        id: string;
    }>;
};

export default async function VerifyEmailOnboarding({ params }: Props) {
    const { id } = await params;

    const restaurant = await getRestaurantMeServerApi();

    if (!restaurant) {
        redirect('/restaurant-onboarding');
    }

    if (restaurant.verifyStatus !== RestaurantVerifyStatus.EMAIL_PENDING) {
        redirectToCorrectPage(restaurant);
    }

    return <VerifyEmailOnboardingPage _id={id} />;
}
