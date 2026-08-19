import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { Public, ResponseMessage } from '@app/decorator/customize';
import { CurrentUser } from '@app/decorator/current-user.decorator';
import type { AuthUser } from '@app/auth/types/auth-jwt-user.type';

@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post()
  @Public()
  create(@Body() createNotificationDto: CreateNotificationDto) {
    return this.notificationService.create(createNotificationDto);
  }

  @Get()
  @Public()
  findAll() {
    return this.notificationService.findAll();
  }

  @Delete()
  @Public()
  removeAll() {
    return this.notificationService.removeAll();
  }

  @Get('unread-count')
  getUnreadCount(@CurrentUser() user: AuthUser) {
    return this.notificationService.getUnreadCount(user._id);
  }

  @Get('mark-all-as-read')
  @ResponseMessage('Đánh dấu đã đọc tất cả thông báo thành công')
  markAllAsRead(@CurrentUser() user: AuthUser) {
    return this.notificationService.markAllAsRead(user._id);
  }

  @Get('mark-as-read/:id')
  markAsRead(@Param('id') id: string) {
    return this.notificationService.markAsRead(id);
  }

  @Get(':id')
  @Public()
  findOne(@Param('id') id: string) {
    return this.notificationService.findOne(id);
  }

  @Delete(':id')
  @Public()
  remove(@Param('id') id: string) {
    return this.notificationService.remove(id);
  }
}
