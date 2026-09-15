import { Controller, Get, Param, Delete, Patch, Query } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { ResponseMessage } from '@app/decorator/customize';
import { CurrentUser } from '@app/decorator/current-user.decorator';
import type { AuthUser } from '@app/auth/types/auth-jwt-user.type';

@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  findAll(
    @CurrentUser() user: AuthUser,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '5',
  ) {
    return this.notificationService.findAll(user._id, +page, +limit);
  }

  @Get('unread')
  findAllUnread(
    @CurrentUser() user: AuthUser,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '5',
  ) {
    return this.notificationService.findAllUnread(user._id, +page, +limit);
  }

  @Get('unread-count')
  getUnreadCount(@CurrentUser() user: AuthUser) {
    return this.notificationService.getUnreadCount(user._id);
  }

  @Patch('mark-all-as-read')
  @ResponseMessage('Đánh dấu đã đọc tất cả thông báo thành công')
  markAllAsRead(@CurrentUser() user: AuthUser) {
    return this.notificationService.markAllAsRead(user._id);
  }

  @Patch('mark-as-read/:id')
  markAsRead(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.notificationService.markAsRead(user._id, id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.notificationService.findOne(id, user._id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.notificationService.remove(id, user._id);
  }
}
