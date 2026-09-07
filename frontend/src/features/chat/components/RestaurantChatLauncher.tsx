"use client";

import { useCallback, useEffect, useState } from "react";
import { Button, Spinner } from "@heroui/react";
import { MessageCircle } from "lucide-react";
import { useRestaurantMe } from "@/features/restaurant/hooks/useRestaurantMe";
import { useAuth } from "@/shared/hooks/useAuth";
import { useToast } from "@/shared/hooks/useToast";
import { chatApi } from "../api/chat-api";
import ChatPanel from "./ChatPanel";
import { ChatConversation } from "../types/chat.types";

export default function RestaurantChatLauncher() {
	const { data: restaurant } = useRestaurantMe();
	const { user } = useAuth();
	const { showToast } = useToast();
	const [isOpen, setIsOpen] = useState(false);
	const [conversationId, setConversationId] = useState<string>();
	const [isLoading, setIsLoading] = useState(false);
	const [conversations, setConversations] = useState<ChatConversation[]>([]);

	const openLatestConversation = useCallback(
		async (requestedConversationId?: string) => {
			setIsLoading(true);
			try {
				const conversations = await chatApi.getConversations();
				setConversations(conversations);
				const conversation = conversations.find(
					(item) => item._id === requestedConversationId,
				) ?? conversations[0];

				if (!conversation) {
					showToast(
						"info",
						"Chưa có cuộc trò chuyện",
						"Khi user nhắn tin, cuộc trò chuyện sẽ xuất hiện ở đây.",
					);
					return;
				}

				setConversationId(conversation._id);
				setIsOpen(true);
			} catch {
				showToast(
					"error",
					"Không thể tải tin nhắn",
					"Vui lòng thử lại sau.",
				);
			} finally {
				setIsLoading(false);
			}
		},
		[showToast],
	);

	const handleConversationSelect = (selectedId: string) => {
		setConversationId(selectedId);
		setConversations((current) =>
			current.map((conversation) =>
				conversation._id === selectedId
					? { ...conversation, unreadForRestaurant: false }
					: conversation,
			),
		);
	};

	useEffect(() => {
		const handleNotification = (event: Event) => {
			const conversationId = (
				event as CustomEvent<{ conversationId?: string }>
			).detail?.conversationId;
			if (conversationId) void openLatestConversation(conversationId);
		};

		window.addEventListener("chat:open", handleNotification);
		return () =>
			window.removeEventListener("chat:open", handleNotification);
	}, [openLatestConversation]);

	return (
		<>
			<Button
				variant="secondary"
				className="fixed bottom-6 right-6 z-40 shadow-lg"
				onPress={() => void openLatestConversation()}
				isDisabled={isLoading}
			>
				{isLoading ? (
					<Spinner size="sm" />
				) : (
					<MessageCircle size={17} />
				)}
				Tin nhắn
			</Button>

			<ChatPanel
				isOpen={isOpen}
				conversationId={conversationId}
				conversations={conversations}
				isRestaurantInbox
				onConversationSelect={handleConversationSelect}
				currentUserId={user?._id}
				restaurantName={restaurant?.restaurantName ?? "nhà hàng"}
				onClose={() => setIsOpen(false)}
			/>
		</>
	);
}
