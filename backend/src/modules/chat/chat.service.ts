import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import type { AuthUser } from '@app/auth/types/auth-jwt-user.type';
import { RestaurantsService } from '@app/modules/restaurants/restaurants.service';
import {
  Conversation,
  ConversationDocument,
} from './schemas/conversation.schema';
import { Message, MessageDocument } from './schemas/message.schema';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { SendMessageDto } from './dto/send-message.dto';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Conversation.name)
    private readonly conversationModel: Model<ConversationDocument>,
    @InjectModel(Message.name)
    private readonly messageModel: Model<MessageDocument>,
    private readonly restaurantsService: RestaurantsService,
  ) {}

  async createOrGetConversation(userId: string, dto: CreateConversationDto) {
    const userObjectId = this.toObjectId(
      userId,
      'Định dạng ID người dùng không hợp lệ',
    );
    const restaurant = await this.restaurantsService.getRestaurantById(
      dto.restaurantId,
    );

    const existing = await this.conversationModel
      .findOne({ userId: userObjectId, restaurantId: restaurant._id })
      .lean();

    if (existing) {
      return existing;
    }

    return this.conversationModel.create({
      userId: userObjectId,
      restaurantId: restaurant._id,
      restaurantOwnerId: restaurant.userId,
    });
  }

  async listConversations(userId: string, page = 1, limit = 20) {
    const normalizedPage = Math.max(1, page);
    const normalizedLimit = Math.min(100, Math.max(1, limit));
    const userObjectId = this.toObjectId(
      userId,
      'Định dạng ID người dùng không hợp lệ',
    );
    const query = {
      $or: [{ userId: userObjectId }, { restaurantOwnerId: userObjectId }],
    };
    const skip = (normalizedPage - 1) * normalizedLimit;

    const [data, total] = await Promise.all([
      this.conversationModel
        .find(query)
        .sort({ lastMessageAt: -1, updatedAt: -1 })
        .skip(skip)
        .limit(normalizedLimit)
        .lean(),
      this.conversationModel.countDocuments(query),
    ]);

    return {
      data,
      total,
      page: normalizedPage,
      limit: normalizedLimit,
      hasMore: skip + data.length < total,
    };
  }

  async getConversationForMember(userId: string, conversationId: string) {
    const conversation = await this.findConversation(conversationId);
    this.assertMember(conversation, userId);
    return conversation;
  }

  async listMessages(
    userId: string,
    conversationId: string,
    page = 1,
    limit = 30,
  ) {
    const conversation = await this.findConversation(conversationId);
    this.assertMember(conversation, userId);

    const normalizedPage = Math.max(1, page);
    const normalizedLimit = Math.min(100, Math.max(1, limit));
    const skip = (normalizedPage - 1) * normalizedLimit;
    const query = { conversationId: conversation._id };

    const [data, total] = await Promise.all([
      this.messageModel
        .find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(normalizedLimit)
        .lean(),
      this.messageModel.countDocuments(query),
    ]);

    return {
      data: data.reverse(),
      total,
      page: normalizedPage,
      limit: normalizedLimit,
      hasMore: skip + data.length < total,
    };
  }

  async createMessage(user: AuthUser, dto: SendMessageDto) {
    if (!dto?.conversationId || !dto.content) {
      throw new BadRequestException('Thiếu thông tin tin nhắn');
    }

    const conversation = await this.findConversation(dto.conversationId);
    this.assertMember(conversation, user._id);

    const content = dto.content.trim();
    if (!content) {
      throw new BadRequestException('Nội dung tin nhắn không được để trống');
    }
    if (content.length > 2000) {
      throw new BadRequestException(
        'Nội dung tin nhắn không được vượt quá 2000 ký tự',
      );
    }

    if (dto.clientMessageId) {
      const existing = await this.messageModel
        .findOne({
          conversationId: conversation._id,
          clientMessageId: dto.clientMessageId,
        })
        .lean();
      if (existing) {
        return existing;
      }
    }

    const createdAt = new Date();
    const message = await this.messageModel.create({
      conversationId: conversation._id,
      senderId: this.toObjectId(
        user._id,
        'Định dạng ID người dùng không hợp lệ',
      ),
      senderRole: user.role,
      content,
      clientMessageId: dto.clientMessageId,
    });

    await this.conversationModel.updateOne(
      { _id: conversation._id },
      { $set: { lastMessageId: message._id, lastMessageAt: createdAt } },
    );

    return message.toObject();
  }

  private async findConversation(conversationId: string) {
    if (!Types.ObjectId.isValid(conversationId)) {
      throw new BadRequestException('Định dạng ID cuộc hội thoại không hợp lệ');
    }

    const conversation = await this.conversationModel
      .findById(conversationId)
      .lean();
    if (!conversation) {
      throw new NotFoundException('Cuộc hội thoại không tồn tại');
    }
    return conversation;
  }

  private assertMember(
    conversation: Pick<Conversation, 'userId' | 'restaurantOwnerId'>,
    userId: string,
  ) {
    const memberIds = [conversation.userId, conversation.restaurantOwnerId].map(
      (id) => id.toString(),
    );
    if (!memberIds.includes(userId)) {
      throw new ForbiddenException('Bạn không thuộc cuộc hội thoại này');
    }
  }

  private toObjectId(value: string, message: string) {
    if (!Types.ObjectId.isValid(value)) {
      throw new BadRequestException(message);
    }
    return new Types.ObjectId(value);
  }
}
