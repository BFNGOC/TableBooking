import { clientRequest } from '@/shared/library/axios/client-api';
import {
    CreateReviewPayload,
    FindReviewsParams,
    ReplyReviewPayload,
    UpdateReviewPayload,
} from '../types/review.dto';
import { IReview } from '../types/review.type';

const BASE = '/reviews';

export const reviewApi = {
    // ─── Public ───────────────────────────────────────────────────────────────
    getReviews: async (params: FindReviewsParams) => {
        const res = await clientRequest({
            url: BASE,
            method: 'GET',
            queryParams: params as Record<string, any>,
        });
        return (res as any).data as { data: IReview[]; meta: any };
    },

    // ─── Customer ─────────────────────────────────────────────────────────────
    getMyReviews: async (params: FindReviewsParams) => {
        const res = await clientRequest({
            url: `${BASE}/me`,
            method: 'GET',
            queryParams: params as Record<string, any>,
        });
        return (res as any).data as { data: IReview[]; meta: any };
    },

    createReview: (body: CreateReviewPayload) =>
        clientRequest({ url: BASE, method: 'POST', body }),

    updateReview: ({ id, body }: { id: string; body: UpdateReviewPayload }) =>
        clientRequest({ url: `${BASE}/${id}`, method: 'PATCH', body }),

    deleteReview: (id: string) =>
        clientRequest({ url: `${BASE}/${id}`, method: 'DELETE' }),

    // ─── Restaurant ───────────────────────────────────────────────────────────
    replyReview: ({ id, body }: { id: string; body: ReplyReviewPayload }) =>
        clientRequest({ url: `${BASE}/${id}/reply`, method: 'POST', body }),

    deleteReply: (id: string) =>
        clientRequest({ url: `${BASE}/${id}/reply`, method: 'DELETE' }),
};
