import { clientRequest } from '@/shared/library/axios/client-api';
import { CreatePaymentPayload } from '../types/payment.dto';

const API_URL_PREFIX = '/payment';

export const createPaymentApi = async (restaurantId: string, body: CreatePaymentPayload) => {
    const res = await clientRequest<any>({
        url: `${API_URL_PREFIX}`,
        method: 'POST',
        body,
    });

    return res;
};

export const getPaymentMe = async (paymentId: string) => {
    const res = await clientRequest<any>({
        url: `${API_URL_PREFIX}/${paymentId}`,
        method: 'GET',
    });

    return res;
};
