export type CreateAreaPayload = {
	name: string;
	description?: string;
};

export type UpdateAreaPayload = Partial<CreateAreaPayload>;

export type FindAreasParams = {
	restaurantId: string;
};
