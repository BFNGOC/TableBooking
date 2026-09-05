import {
  WsException,
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { SocketService } from './socket.service';
import { SOCKET_EVENTS, SOCKET_ROOMS } from './socket.constants';
import { ChatService } from '@app/modules/chat/chat.service';
import { SendMessageDto } from '@app/modules/chat/dto/send-message.dto';
import type { AuthUser } from '@app/auth/types/auth-jwt-user.type';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private readonly socketService: SocketService,
    private readonly jwtService: JwtService,
    private readonly chatService: ChatService,
  ) {}

  afterInit(server: any) {
    this.socketService.setServer(server);

    console.log('Socket.IO server initialized');
  }

  async handleConnection(client: Socket) {
    console.log('Client connected:', client.id);

    const token = client.handshake.auth?.token;

    if (!token) {
      console.log('Socket missing token');
      client.disconnect();
      return;
    }

    try {
      const payload = this.jwtService.verify(token);

      client.data.userId = payload.sub;
      client.data.role = payload.role;

      const userRoom = SOCKET_ROOMS.USER(payload.sub);

      await client.join(userRoom);

      console.log('Socket authenticated:', {
        socketId: client.id,
        userId: payload.sub,
        role: payload.role,
      });

      console.log('Socket joined room:', userRoom);
    } catch (error) {
      console.log('Invalid socket token', error);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    console.log('Client disconnected:', client.id);
  }

  @SubscribeMessage(SOCKET_EVENTS.TEST_SEND)
  handleTestMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { message: string },
  ) {
    console.log('Test message received:', data);

    const userId = client.data.userId;

    this.socketService.emitToUser(userId, SOCKET_EVENTS.TEST_RESPONSE, {
      message: 'Hello from backend!',
      received: data.message,
    });
  }

  @SubscribeMessage(SOCKET_EVENTS.CHAT_JOIN)
  async handleChatJoin(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { conversationId: string },
  ) {
    if (!data?.conversationId) {
      throw new WsException('Thiếu ID cuộc hội thoại');
    }

    const conversation = await this.chatService.getConversationForMember(
      client.data.userId,
      data.conversationId,
    );
    const room = SOCKET_ROOMS.CONVERSATION(conversation._id.toString());
    await client.join(room);

    return { conversationId: conversation._id.toString(), room };
  }

  @SubscribeMessage(SOCKET_EVENTS.CHAT_LEAVE)
  async handleChatLeave(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { conversationId: string },
  ) {
    if (!data?.conversationId) {
      throw new WsException('Thiếu ID cuộc hội thoại');
    }

    const conversation = await this.chatService.getConversationForMember(
      client.data.userId,
      data.conversationId,
    );
    const room = SOCKET_ROOMS.CONVERSATION(conversation._id.toString());
    await client.leave(room);

    return { conversationId: conversation._id.toString(), room };
  }

  @SubscribeMessage(SOCKET_EVENTS.CHAT_SEND)
  async handleChatSend(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: SendMessageDto,
  ) {
    const user: AuthUser = {
      _id: client.data.userId,
      role: client.data.role,
      email: client.data.email,
    };
    const message = await this.chatService.createMessage(user, data);
    const room = SOCKET_ROOMS.CONVERSATION(data.conversationId);

    this.socketService.emitToRoom(room, SOCKET_EVENTS.CHAT_MESSAGE, message);

    return message;
  }
}
