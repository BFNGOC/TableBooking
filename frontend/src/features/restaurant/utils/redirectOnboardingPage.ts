import { redirect } from 'next/navigation';
import { IRestaurant, RestaurantVerifyStatus } from '../types/restaurant.type';

export function redirectToCorrectPage(restaurant: IRestaurant) {
    const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';

    switch (restaurant.verifyStatus) {
        case RestaurantVerifyStatus.EMAIL_PENDING:
            const emailPath = `/restaurant-onboarding/verify-email/${restaurant._id}`;
            if (currentPath !== emailPath) {
                return redirect(emailPath);
            }
            return;

        case RestaurantVerifyStatus.PENDING:
        case RestaurantVerifyStatus.REJECTED:
        case RestaurantVerifyStatus.APPROVED:
            const pendingPath = '/restaurant-onboarding/pending';
            if (currentPath !== pendingPath) {
                return redirect(pendingPath);
            }
            return;

        default:
            return;
    }
}
