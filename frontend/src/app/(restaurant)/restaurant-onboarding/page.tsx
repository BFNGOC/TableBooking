import { getRestaurantMeServerApi } from '@/features/restaurant/api/restaurant-server-api';
import RestaurantOnboardingPage from '@/features/restaurant/pages/RestaurantOnboardingPage';
import { redirectToCorrectPage } from '@/features/restaurant/utils/redirectOnboardingPage';

async function RestaurantOnboarding() {
    const restaurant = await getRestaurantMeServerApi();

    if (restaurant) {
        redirectToCorrectPage(restaurant);
    }

    return <RestaurantOnboardingPage />;
}

export default RestaurantOnboarding;
