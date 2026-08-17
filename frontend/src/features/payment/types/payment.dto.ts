import { IPayment } from './payment.type';

export type CreatePaymentPayload = Pick<IPayment, 'bookingId' | 'type' | 'method'>;
