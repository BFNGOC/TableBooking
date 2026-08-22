import {
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

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private readonly socketService: SocketService,
    private readonly jwtService: JwtService,
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
}
