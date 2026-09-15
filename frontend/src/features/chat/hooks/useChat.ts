import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { chatApi } from "../api/chat-api";
import { chatQueryKeys } from "../constants/query-key";
import { ChatConversation, ChatMessage } from "../types/chat.types";
import { socket } from "@/shared/library/socket/socket";
import { SOCKET_EVENTS } from "@/shared/constants/socket-constants";
import { useToast } from "@/shared/hooks/useToast";

export const useChatConversations = () =>
	useQuery({
		queryKey: chatQueryKeys.conversations(),
		queryFn: chatApi.getConversations,
	});

export const useChatMessages = (
	conversationId: string | undefined,
	page: number,
	limit = 10,
) =>
	useQuery({
		queryKey: chatQueryKeys.messages(conversationId ?? "", page, limit),
		queryFn: () => chatApi.getMessages(conversationId!, page, limit),
		enabled: Boolean(conversationId),
	});

export const useCreateOrGetConversation = () => {
	const { showToast } = useToast();

	return useMutation({
		mutationFn: (restaurantId: string) =>
			chatApi.createOrGetConversation(restaurantId),
		onError: (error: any) => {
			showToast(
				"error",
				"Không thể mở cuộc trò chuyện",
				error?.message || "Đã xảy ra lỗi khi mở cuộc trò chuyện.",
			);
		},
	});
};

export const useMarkConversationAsRead = () => {
	const queryClient = useQueryClient();
	const { showToast } = useToast();

	return useMutation({
		mutationFn: (conversationId: string) =>
			chatApi.markAsRead(conversationId),
		onSuccess: (_, conversationId) => {
			queryClient.setQueryData(
				chatQueryKeys.conversations(),
				(current: ChatConversation[] | undefined) =>
					current?.map((conversation) =>
						conversation._id === conversationId
							? {
									...conversation,
									unreadForRestaurant: false,
									unreadForUser: false,
								}
							: conversation,
					),
			);
		},
		onError: (error: any) => {
			showToast(
				"error",
				"Không thể cập nhật trạng thái tin nhắn",
				error?.message || "Đã xảy ra lỗi khi đánh dấu tin nhắn đã đọc.",
			);
		},
	});
};

export const useSendChatMessage = () => {
	const { showToast } = useToast();

	return useMutation({
		mutationFn: (payload: {
			conversationId: string;
			content: string;
			clientMessageId: string;
		}) =>
			new Promise<ChatMessage>((resolve, reject) => {
				if (!socket.connected) {
					reject(new Error("Kết nối chat chưa sẵn sàng."));
					return;
				}

				const timeout = window.setTimeout(() => {
					reject(new Error("Gửi tin nhắn quá thời gian chờ."));
				}, 10000);

				socket.emit(
					SOCKET_EVENTS.CHAT_SEND,
					payload,
					(
						message:
							| ChatMessage
							| { message?: string; error?: string },
					) => {
						window.clearTimeout(timeout);
						if ("_id" in message) {
							resolve(message);
							return;
						}
						reject(
							new Error(
								message.message ||
									message.error ||
									"Không thể gửi tin nhắn.",
							),
						);
					},
				);
			}),
		onError: (error: any) => {
			showToast(
				"error",
				"Gửi tin nhắn thất bại",
				error?.message || "Đã xảy ra lỗi khi gửi tin nhắn.",
			);
		},
	});
};
