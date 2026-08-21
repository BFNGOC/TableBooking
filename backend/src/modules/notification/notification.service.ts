import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  Notification,
  NotificationReferenceModel,
  NotificationType,
} from './schemas/notification.schema';

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel(Notification.name)
    private notificationModel: Model<Notification>,
  ) {}

  async create(createNotificationDto: CreateNotificationDto) {
    const notification = await this.notificationModel.create(
      createNotificationDto,
    );

    return notification;
  }

  async findAll() {
    const notifications = await this.notificationModel.find();

    if (!notifications || notifications.length === 0) {
      throw new NotFoundException('Không tìm thấy thông báo nào');
    }

    return notifications;
  }

  async findAllUnread(userId: string) {
    if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestException('Định dạng ID người dùng không hợp lệ');
    }

    const notifications = await this.notificationModel.find({
      userId,
      isRead: false,
    });

    return notifications;
  }

  async findOne(id: string) {
    const notification = await this.notificationModel.findById(id);

    if (!notification) {
      throw new NotFoundException('Thông báo không tồn tại');
    }

    return notification;
  }

  async remove(id: string) {
    const notification = await this.notificationModel.findByIdAndDelete(id);

    if (!notification) {
      throw new NotFoundException('Thông báo không tồn tại');
    }

    return notification;
  }

  async removeAll() {
    const result = await this.notificationModel.deleteMany({});

    if (result.deletedCount === 0) {
      throw new NotFoundException('Không có thông báo nào để xóa');
    }

    return result;
  }

  async getUnreadCount(userId: string) {
    if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestException('Định dạng ID người dùng không hợp lệ');
    }

    const count = await this.notificationModel.countDocuments({
      userId,
      isRead: false,
    });

    return count;
  }

  async markAsRead(userId: string, id: string) {
    if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestException('Định dạng ID người dùng không hợp lệ');
    }

    const notification = await this.notificationModel.findOneAndUpdate(
      { _id: id, userId },
      { isRead: true, readAt: new Date() },
      { new: true },
    );

    if (!notification) {
      throw new NotFoundException('Thông báo không tồn tại');
    }

    return notification;
  }

  async markAllAsRead(userId: string) {
    if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestException('Định dạng ID người dùng không hợp lệ');
    }

    const result = await this.notificationModel.updateMany(
      { userId, isRead: false },
      { isRead: true, readAt: new Date() },
    );

    if (result.modifiedCount === 0) {
      throw new NotFoundException('Không có thông báo chưa đọc để đánh dấu');
    }

    return result;
  }

  // --------------------------------------
  // Booking notifications
  // --------------------------------------

  // --------------------------------------
  // Booking notifications
  // --------------------------------------

  notifyBookingCreated(
    userId: string,
    booking: Record<string, any>,
    title: string,
    message: string,
  ) {
    return this.create({
      userId,
      type: NotificationType.BOOKING,
      title,
      message,
      referenceId: booking._id,
      referenceModel: NotificationReferenceModel.BOOKING,
      data: {
        bookingStatus: 'PENDING',
      },
    });
  }

  notifyBookingConfirmed(
    userId: string,
    booking: Record<string, any>,
    title: string,
    message: string,
  ) {
    return this.create({
      userId,
      type: NotificationType.BOOKING,
      title,
      message,
      referenceId: booking._id,
      referenceModel: NotificationReferenceModel.BOOKING,
      data: {
        bookingStatus: 'CONFIRMED',
      },
    });
  }

  notifyBookingRejected(userId: string, booking: Record<string, any>) {
    return this.create({
      userId,
      type: NotificationType.BOOKING,
      title: 'Đặt bàn bị từ chối',
      message: `Nhà hàng ${booking.restaurantName} đã từ chối yêu cầu đặt bàn của bạn.`,
      referenceId: booking._id,
      referenceModel: NotificationReferenceModel.BOOKING,
      data: {
        bookingStatus: 'REJECTED',
        rejectionReason: booking.rejectionReason ?? null,
      },
    });
  }

  notifyBookingCancelledByUser(userId: string, booking: Record<string, any>) {
    return this.create({
      userId,
      type: NotificationType.BOOKING,
      title: 'Đặt bàn đã được hủy',
      message: `Người dùng ${booking.userId.name} đã hủy đặt bàn tại nhà hàng ${booking.restaurantName}.`,
      referenceId: booking._id,
      referenceModel: NotificationReferenceModel.BOOKING,
      data: {
        bookingStatus: 'CANCELLED',
        cancelReason: booking.cancelReason ?? null,
      },
    });
  }

  notifyBookingCancelledByRestaurant(
    userId: string,
    booking: Record<string, any>,
  ) {
    return this.create({
      userId,
      type: NotificationType.BOOKING,
      title: 'Nhà hàng đã hủy đặt bàn',
      message: `Nhà hàng ${booking.restaurantName} đã hủy đặt bàn của bạn.`,
      referenceId: booking._id,
      referenceModel: NotificationReferenceModel.BOOKING,
      data: {
        bookingStatus: 'CANCELLED',
        cancelReason: booking.cancelReason ?? null,
      },
    });
  }

  notifyBookingExpired(userId: string, booking: Record<string, any>) {
    return this.create({
      userId,
      type: NotificationType.BOOKING,
      title: 'Đặt bàn đã bị hủy',
      message: `Đặt bàn tại nhà hàng ${booking.restaurantName} đã bị hủy do quá thời gian thanh toán.`,
      referenceId: booking._id,
      referenceModel: NotificationReferenceModel.BOOKING,
      data: {
        bookingStatus: 'CANCELLED',
        cancelReason: 'Booking expired',
      },
    });
  }

  notifyBookingNoShow(userId: string, booking: Record<string, any>) {
    return this.create({
      userId,
      type: NotificationType.BOOKING,
      title: 'Bạn đã không đến',
      message: `Bạn đã không check-in cho đặt bàn tại nhà hàng ${booking.restaurantName} vào ngày ${booking.bookingDate}.`,
      referenceId: booking._id,
      referenceModel: NotificationReferenceModel.BOOKING,
      data: {
        bookingStatus: 'NO_SHOW',
      },
    });
  }

  notifyBookingCheckedIn(userId: string, booking: Record<string, any>) {
    return this.create({
      userId,
      type: NotificationType.BOOKING,
      title: 'Check-in thành công',
      message: `Bạn đã check-in thành công tại nhà hàng ${booking.restaurantName}. Chúc bạn có một bữa ăn ngon!`,
      referenceId: booking._id,
      referenceModel: NotificationReferenceModel.BOOKING,
      data: {
        bookingStatus: 'CHECKED_IN',
      },
    });
  }

  // --------------------------------------
  // Payment notifications
  // --------------------------------------

  notifyPaymentSuccess(
    userId: string,
    payment: Record<string, any>,
    booking: Record<string, any>,
  ) {
    return this.create({
      userId,
      type: NotificationType.PAYMENT,
      title: 'Thanh toán thành công',
      message: `Bạn đã thanh toán thành công cho đặt bàn tại nhà hàng ${booking.restaurantName}.`,
      referenceId: payment._id,
      referenceModel: NotificationReferenceModel.PAYMENT,
      data: {
        paymentStatus: 'PAID',
        amount: payment.amount,
        bookingId: booking._id,
        bookingStatus: 'CONFIRMED',
      },
    });
  }
}
