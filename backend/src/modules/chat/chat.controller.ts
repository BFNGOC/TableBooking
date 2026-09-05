import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { CurrentUser } from '@app/decorator/current-user.decorator';
import type { AuthUser } from '@app/auth/types/auth-jwt-user.type';
import { ChatService } from './chat.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { SendMessageDto } from './dto/send-message.dto';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('conversations')
  createConversation(
    @CurrentUser() user: AuthUser,
    @Body() dto: CreateConversationDto,
  ) {
    return this.chatService.createOrGetConversation(user._id, dto);
  }

  @Get('conversations')
  listConversations(
    @CurrentUser() user: AuthUser,
    @Query('page') page = '1',
    @Query('limit') limit = '20',
  ) {
    return this.chatService.listConversations(user._id, +page, +limit);
  }

  @Get('conversations/:conversationId')
  getConversation(
    @CurrentUser() user: AuthUser,
    @Param('conversationId') conversationId: string,
  ) {
    return this.chatService.getConversationForMember(user._id, conversationId);
  }

  @Get('conversations/:conversationId/messages')
  listMessages(
    @CurrentUser() user: AuthUser,
    @Param('conversationId') conversationId: string,
    @Query('page') page = '1',
    @Query('limit') limit = '30',
  ) {
    return this.chatService.listMessages(
      user._id,
      conversationId,
      +page,
      +limit,
    );
  }

  @Post('conversations/:conversationId/messages')
  createMessage(
    @CurrentUser() user: AuthUser,
    @Param('conversationId') conversationId: string,
    @Body() dto: SendMessageDto,
  ) {
    return this.chatService.createMessage(user, {
      ...dto,
      conversationId,
    });
  }
}
