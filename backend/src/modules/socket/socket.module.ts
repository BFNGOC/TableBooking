import { Module } from '@nestjs/common';

import { SocketGateway } from './socket.gateway';
import { SocketService } from './socket.service';
import { AuthModule } from '@app/auth/auth.module';
import { ChatModule } from '@app/modules/chat/chat.module';

@Module({
  imports: [AuthModule, ChatModule],
  providers: [SocketGateway, SocketService],
  exports: [SocketService],
})
export class SocketModule {}
