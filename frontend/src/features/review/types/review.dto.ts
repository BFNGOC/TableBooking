import { IReviewImage } from './review.type';

export interface CreateReviewPayload {
    bookingId: string;
    rating: number;
    comment?: string;
    images?: IReviewImage[];
}

export interface UpdateReviewPayload {
    rating?: number;
    comment?: string;
    images?: IReviewImage[];
}

export interface FindReviewsParams {
    restaurantId?: string;
    rating?: number;
    currentPage?: number;
    pageSize?: number;
}

export interface ReplyReviewPayload {
    content: string;
}
