export interface ChatConversation {
	_id: string;
	userId: string | {
		_id: string;
		name?: string;
		email?: string;
	};
	restaurantId: string;
	restaurantOwnerId: string;
	lastMessageAt?: string;
	unreadForUser?: boolean;
	unreadForRestaurant?: boolean;
}

export interface ChatMessage {
	_id: string;
	conversationId: string;
	senderId: string;
	content: string;
	createdAt?: string;
	clientMessageId?: string;
}

export interface ChatMessagesResponse {
	data: ChatMessage[];
	total: number;
	hasMore: boolean;
}
