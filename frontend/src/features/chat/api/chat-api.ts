import { clientRequest } from "@/shared/library/axios/client-api";
import { ChatConversation, ChatMessagesResponse } from "../types/chat.types";

export const chatApi = {
	createOrGetConversation: async (restaurantId: string) => {
		const response = await clientRequest<ChatConversation>({
			url: "/chat/conversations",
			method: "POST",
			body: { restaurantId },
		});
		return response.data;
	},
	getConversations: async () => {
		const response = await clientRequest<{ data: ChatConversation[] }>({
			url: "/chat/conversations",
			method: "GET",
			queryParams: { page: 1, limit: 50 },
		});
		return response.data.data;
	},
	getMessages: async (conversationId: string, page = 1, limit = 10) => {
		const response = await clientRequest<ChatMessagesResponse>({
			url: `/chat/conversations/${conversationId}/messages`,
			method: "GET",
			queryParams: { page, limit },
		});
		return response.data;
	},
	markAsRead: async (conversationId: string) => {
		await clientRequest({
			url: `/chat/conversations/${conversationId}/read`,
			method: "POST",
		});
	},
};
