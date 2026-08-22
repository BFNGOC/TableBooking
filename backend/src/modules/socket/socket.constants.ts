export const SOCKET_ROOMS = {
  USER: (userId: string) => `user:${userId}`,
  CONVERSATION: (conversationId: string) => `conversation:${conversationId}`,
} as const;

export const SOCKET_EVENTS = {
  TEST_SEND: 'test:send',
  TEST_RESPONSE: 'test:response',

  NOTIFICATION_NEW: 'notification:new',

  BOOKING_UPDATED: 'booking:updated',

  CHAT_MESSAGE: 'chat:message',
} as const;
