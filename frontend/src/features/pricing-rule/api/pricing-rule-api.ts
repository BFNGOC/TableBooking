import { clientRequest } from '@/shared/library/axios/client-api';
import {
    CreatePricingRulePayload,
    FindPricingRulesParams,
    UpdatePricingRulePayload,
} from '../types/pricing-rule.dto';

const BASE = '/pricing-rule/restaurant';

export const pricingRuleApi = {
    getAll: async (params: FindPricingRulesParams) => {
        const res = await clientRequest({
            url: `${BASE}/my`,
            method: 'GET',
            queryParams: params as Record<string, any>,
        });
        // clientRequest trả về IBackendRes<{data,meta}> — cần lấy .data để useTable đọc đúng
        return (res as any).data as { data: any[]; meta: any };
    },

    getOne: (id: string) =>
        clientRequest({
            url: `${BASE}/${id}`,
            method: 'GET',
        }),

    create: (body: CreatePricingRulePayload) =>
        clientRequest({
            url: BASE,
            method: 'POST',
            body,
        }),

    update: ({ id, body }: { id: string; body: UpdatePricingRulePayload }) =>
        clientRequest({
            url: `${BASE}/${id}`,
            method: 'PATCH',
            body,
        }),

    remove: (id: string) =>
        clientRequest({
            url: `${BASE}/${id}`,
            method: 'DELETE',
        }),
};
