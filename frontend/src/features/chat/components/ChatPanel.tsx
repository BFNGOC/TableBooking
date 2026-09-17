"use client";

import { UIEvent, useEffect, useRef, useState } from "react";
import { Button, Spinner } from "@heroui/react";
import { Send, MessageCircle } from "lucide-react";
import CustomForm from "@/shared/components/form/CustomForm";
import ModalCustom from "@/shared/components/modals/ModalCustom";
import { socket } from "@/shared/library/socket/socket";
import { SOCKET_EVENTS } from "@/shared/constants/socket-constants";
import { CHAT_MESSAGE_FORM_FIELDS } from "../constants/chat-form-fields";
import { ChatConversation, ChatMessage } from "../types/chat.types";
import {
	useChatMessages,
	useCreateOrGetConversation,
	useMarkConversationAsRead,
	useSendChatMessage,
} from "../hooks/useChat";

interface ChatPanelProps {
	isOpen: boolean;
	restaurantId?: string;
	restaurantName: string;
	currentUserId?: string;
	conversationId?: string;
	conversations?: ChatConversation[];
	isRestaurantInbox?: boolean;
	onConversationSelect?: (conversationId: string) => void;
	onClose: () => void;
}

interface ChatFormValues {
	content?: string;
}

export default function ChatPanel({
	isOpen,
	restaurantId,
	restaurantName,
	currentUserId,
	conversationId: initialConversationId,
	conversations = [],
	isRestaurantInbox = false,
	onConversationSelect,
	onClose,
}: ChatPanelProps) {
	const [conversationId, setConversationId] = useState<string>();
	const selectedConversation = conversations.find(
		(item) => item._id === conversationId,
	);

	const [messages, setMessages] = useState<ChatMessage[]>([]);
	const [messagePage, setMessagePage] = useState(1);
	const [hasMoreMessages, setHasMoreMessages] = useState(true);
	const [isLoadingMore, setIsLoadingMore] = useState(false);

	const [formValues, setFormValues] = useState<Partial<ChatFormValues>>({});

	const messagesContainerRef = useRef<HTMLDivElement>(null);
	const previousScrollHeightRef = useRef(0);

	const {
		mutateAsync: createConversation,
		isPending: isCreatingConversation,
	} = useCreateOrGetConversation();
	const messagesQuery = useChatMessages(conversationId, messagePage);
	const { mutate: markConversationAsRead } = useMarkConversationAsRead();
	const { mutate: sendMessage, isPending: isSending } = useSendChatMessage();
	const isLoading =
		isCreatingConversation || (messagesQuery.isLoading && !isLoadingMore);

	useEffect(() => {
		if (!isOpen || (!restaurantId && !initialConversationId)) return;

		let cancelled = false;
		setIsLoadingMore(false);
		setMessagePage(1);
		setHasMoreMessages(true);

		const loadChat = async () => {
			try {
				const conversation = initialConversationId
					? { _id: initialConversationId }
					: await createConversation(restaurantId!);
				if (!cancelled) setConversationId(conversation._id);
			} catch {
				if (!cancelled) setConversationId(undefined);
			}
		};

		void loadChat();
		return () => {
			cancelled = true;
			setConversationId(undefined);
			setMessages([]);
			setMessagePage(1);
			setHasMoreMessages(true);
		};
	}, [createConversation, initialConversationId, isOpen, restaurantId]);

	useEffect(() => {
		const history = messagesQuery.data;
		if (!history || !conversationId) return;

		setHasMoreMessages(history.hasMore);
		if (messagePage === 1) {
			setMessages(history.data ?? []);
			markConversationAsRead(conversationId);
			requestAnimationFrame(() => {
				const container = messagesContainerRef.current;
				if (container) container.scrollTop = container.scrollHeight;
			});
			return;
		}

		setMessages((current) => [...(history.data ?? []), ...current]);
		requestAnimationFrame(() => {
			const container = messagesContainerRef.current;
			if (container) {
				container.scrollTop =
					container.scrollHeight - previousScrollHeightRef.current;
			}
		});
		setIsLoadingMore(false);
	}, [
		conversationId,
		messagePage,
		markConversationAsRead,
		messagesQuery.data,
	]);

	const handleMessagesScroll = async (event: UIEvent<HTMLDivElement>) => {
		const container = event.currentTarget;
		if (
			container.scrollTop !== 0 ||
			!hasMoreMessages ||
			isLoadingMore ||
			!conversationId
		) {
			return;
		}

		setIsLoadingMore(true);
		previousScrollHeightRef.current = container.scrollHeight;
		setMessagePage((current) => current + 1);
	};

	useEffect(() => {
		if (!isOpen || !conversationId || !socket.connected) return;

		const handleMessage = (message: ChatMessage) => {
			if (message.conversationId !== conversationId) return;
			setMessages((current) =>
				current.some((item) => item._id === message._id)
					? current
					: [...current, message],
			);
		};

		socket.emit(SOCKET_EVENTS.CHAT_JOIN, { conversationId });
		socket.on(SOCKET_EVENTS.CHAT_MESSAGE, handleMessage);

		return () => {
			socket.emit(SOCKET_EVENTS.CHAT_LEAVE, { conversationId });
			socket.off(SOCKET_EVENTS.CHAT_MESSAGE, handleMessage);
		};
	}, [conversationId, isOpen]);

	const handleSubmit = async (values: Partial<ChatFormValues>) => {
		const content = values.content?.trim();
		if (!content || !conversationId || isSending) return;

		const clientMessageId = crypto.randomUUID();
		const payload = { conversationId, content, clientMessageId };

		sendMessage(payload, {
			onSuccess: (message) => {
				setMessages((current) =>
					current.some((item) => item._id === message._id)
						? current
						: [...current, message],
				);
				setFormValues({});
			},
		});
	};

	return (
		<ModalCustom
			open={isOpen}
			onOpenChange={(open) => {
				if (!open) onClose();
			}}
			title={`Chat với ${restaurantName}`}
			icon={<MessageCircle size={18} />}
			size="lg"
		>
			<div className="flex w-full min-w-[min(720px,80vw)] gap-4">
				{isRestaurantInbox && (
					<div className="w-56 shrink-0 space-y-2 border-r border-[#e6d8c9] pr-3">
						<p className="px-2 text-sm font-bold text-[#3d2a21]">
							Cuộc trò chuyện
						</p>
						<div className="max-h-[28rem] space-y-1 overflow-y-auto">
							{conversations.map((conversation) => (
								<button
									key={conversation._id}
									type="button"
									onClick={() =>
										onConversationSelect?.(conversation._id)
									}
									className={`flex w-full items-center justify-between rounded-lg px-2 py-3 text-left text-sm ${conversation._id === conversationId ? "bg-[#f5e8df]" : "hover:bg-[#fff8f5]"}`}
								>
									<span className="truncate text-[#3d2a21]">
										{typeof conversation.userId === "object"
											? (conversation.userId.name ??
												conversation.userId.email)
											: conversation.userId}
									</span>
									{conversation.unreadForRestaurant && (
										<span className="size-2 shrink-0 rounded-full bg-red-500" />
									)}
								</button>
							))}
						</div>
					</div>
				)}
				<div className="min-w-0 flex-1 space-y-4">
					{isRestaurantInbox && (
						<p className="text-sm font-semibold text-[#3d2a21]">
							{selectedConversation
								? typeof selectedConversation.userId ===
									"object"
									? (selectedConversation.userId.name ??
										selectedConversation.userId.email)
									: selectedConversation.userId
								: "Chọn một cuộc trò chuyện"}
						</p>
					)}
					<div
						ref={messagesContainerRef}
						onScroll={handleMessagesScroll}
						className="h-80 space-y-3 overflow-y-auto rounded-xl bg-[#fff8f5] p-4"
					>
						{isLoading ? (
							<div className="flex h-full items-center justify-center">
								<Spinner />
							</div>
						) : messages.length === 0 ? (
							<p className="pt-28 text-center text-sm text-[#8c7a6f]">
								Hãy gửi lời chào đến nhà hàng.
							</p>
						) : (
							messages.map((message) => (
								<div
									key={message._id}
									className={`flex ${message.senderId === currentUserId ? "justify-end" : "justify-start"}`}
								>
									<p className="max-w-[80%] rounded-2xl bg-white px-3 py-2 text-sm text-[#3d2a21] shadow-sm">
										{message.content}
									</p>
								</div>
							))
						)}
					</div>

					<CustomForm
						fields={CHAT_MESSAGE_FORM_FIELDS}
						values={formValues}
						onValuesChange={setFormValues}
						onSubmit={handleSubmit}
						renderForm
						footer={
							<Button
								type="submit"
								isPending={isSending}
								isDisabled={
									isLoading || isSending || !conversationId
								}
							>
								<Send size={16} />
								Gửi
							</Button>
						}
						footerClassName="justify-end col-span-12"
					/>
				</div>
			</div>
		</ModalCustom>
	);
}
