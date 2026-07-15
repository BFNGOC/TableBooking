import { getRestaurantMeServerApi } from '@/features/restaurant/api/restaurant-server-api';
import PendingOnboardingPage from '@/features/restaurant/pages/PendingOnboardingPage';
import { RestaurantVerifyStatus } from '@/features/restaurant/types/restaurant.type';
import { redirectToCorrectPage } from '@/features/restaurant/utils/redirectOnboardingPage';
import { redirect } from 'next/navigation';

async function Pending() {
    const restaurant = await getRestaurantMeServerApi();

    if (!restaurant) {
        redirect('/restaurant-onboarding');
    }

    if (
        restaurant.verifyStatus !== RestaurantVerifyStatus.PENDING &&
        restaurant.verifyStatus !== RestaurantVerifyStatus.REJECTED
    ) {
        redirectToCorrectPage(restaurant);
    }
    return <PendingOnboardingPage />;
}

export default Pending;
