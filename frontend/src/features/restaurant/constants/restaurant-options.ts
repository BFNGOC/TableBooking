import { RestaurantVerifyStatus } from '../types/restaurant.type';

export const RESTAURANT_VERIFY_STATUS_OPTIONS: {
    id: RestaurantVerifyStatus;
    text: string;
}[] = [
    { id: RestaurantVerifyStatus.EMAIL_PENDING, text: 'Xác thực email' },
    { id: RestaurantVerifyStatus.PENDING, text: 'Chờ kích hoạt' },
    { id: RestaurantVerifyStatus.APPROVED, text: 'Thành công' },
    { id: RestaurantVerifyStatus.REJECTED, text: 'Thất bại' },
];
