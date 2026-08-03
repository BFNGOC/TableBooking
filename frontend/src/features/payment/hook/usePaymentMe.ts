import { useQuery } from '@tanstack/react-query';
import { getPaymentMe } from '../api/payment-api';
import { paymentQueryKeys } from '../constants/query-key';

export const useGetPaymentMe = (paymentId: string) => {
    return useQuery({
        queryKey: paymentQueryKeys.GET_PAYMENT_ME(paymentId),
        queryFn: () => getPaymentMe(paymentId),
        enabled: !!paymentId,
        staleTime: 1000 * 60 * 5,
    });
};
