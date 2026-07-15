import { redirect } from 'next/navigation';
import { IRestaurant, RestaurantVerifyStatus } from '../types/restaurant.type';

export function redirectToCorrectPage(restaurant: IRestaurant) {
    switch (restaurant.verifyStatus) {
        case RestaurantVerifyStatus.EMAIL_PENDING:
            redirect(`/restaurant-onboarding/verify-email/${restaurant._id}`);

        case RestaurantVerifyStatus.PENDING:
        case RestaurantVerifyStatus.REJECTED:
            redirect('/restaurant-onboarding/pending');

        case RestaurantVerifyStatus.APPROVED:
            redirect('/restaurant/dashboard');
    }
}
