import { FilterParams } from '@/shared/types/filter-params-type';
import { BookingStatus, DepositStatus, PaymentStatus } from './booking.type';

export interface BookingRestaurantParams extends FilterParams {
    status?: BookingStatus;
    paymentStatus?: PaymentStatus;
    depositStatus?: DepositStatus;
    fromDate?: string;
    toDate?: string;
}
