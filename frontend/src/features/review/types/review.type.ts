export interface IReviewImage {
    url: string;
    publicId: string;
}

export interface IReviewReply {
    content: string;
    repliedAt: string | Date;
}

export interface IReviewUser {
    _id: string;
    name: string;
    avatar?: { url: string; publicId: string };
}

export interface IReview {
    _id?: string;
    bookingId?: string;
    userId?: string | IReviewUser;
    restaurantId?: string;
    rating: number;
    comment?: string;
    images?: IReviewImage[];
    restaurantReply?: IReviewReply | null;
    createdAt?: string | Date;
    updatedAt?: string | Date;
}
