export const chatQueryKeys = {
	all: ["chat"] as const,
	conversations: () => [...chatQueryKeys.all, "conversations"] as const,
	messages: (conversationId: string, page: number, limit: number) =>
		[
			...chatQueryKeys.all,
			"messages",
			conversationId,
			page,
			limit,
		] as const,
};
