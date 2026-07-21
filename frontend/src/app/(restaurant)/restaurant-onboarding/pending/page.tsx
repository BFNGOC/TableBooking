import { getRestaurantMeServerApi } from '@/features/restaurant/api/restaurant-server-api';
import PendingOnboardingPage from '@/features/restaurant/pages/onboarding/PendingOnboardingPage';
import { RestaurantVerifyStatus } from '@/features/restaurant/types/restaurant.type';
import { redirectToCorrectPage } from '@/features/restaurant/utils/redirectOnboardingPage';
import { redirect } from 'next/navigation';

async function Pending() {
    const restaurant = await getRestaurantMeServerApi();
    console.log(restaurant);

    if (!restaurant) {
        redirect('/restaurant-onboarding');
    }

    if (restaurant.verifyStatus === RestaurantVerifyStatus.EMAIL_PENDING) {
        redirectToCorrectPage(restaurant);
    }

    return <PendingOnboardingPage />;
}

export default Pending;
