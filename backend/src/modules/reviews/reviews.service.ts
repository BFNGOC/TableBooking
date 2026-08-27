import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Review, ReviewDocument } from './schemas/review.schema';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { QueryReviewDto } from './dto/query-review.dto';
import { ReplyReviewDto } from './dto/reply-review.dto';
import { BookingsService } from '../bookings/bookings.service';
import { RestaurantsService } from '../restaurants/restaurants.service';
import { UploadService } from '../upload/upload.service';
import { BookingStatus } from '../bookings/schemas/booking.schema';
import { buildPagination } from '@app/helpers/pagination.helper';
import { UserRole } from '../users/schemas/user.schema';

@Injectable()
export class ReviewsService {
  private readonly logger = new Logger(ReviewsService.name);

  constructor(
    @InjectModel(Review.name)
    private readonly reviewModel: Model<ReviewDocument>,

    // Chỉ inject service, không inject model từ module khác
    private readonly bookingsService: BookingsService,
    private readonly restaurantsService: RestaurantsService,
    private readonly uploadService: UploadService,
  ) {}

  // ===========================================================
  // CREATE
  // ===========================================================

  async createReview(userId: string, dto: CreateReviewDto) {
    if (!Types.ObjectId.isValid(dto.bookingId)) {
      throw new BadRequestException('Định dạng ID booking không hợp lệ');
    }

    // Lấy thông tin booking thông qua BookingsService (không inject model trực tiếp)
    const booking = await this.bookingsService.findOneBookingMe(
      dto.bookingId,
      userId,
    );

    // Kiểm tra booking thuộc về user (findOneBookingMe đã tự check, nếu không phải sẽ throw 404)
    // Kiểm tra trạng thái booking phải là COMPLETED
    if (booking.status !== BookingStatus.COMPLETED) {
      throw new ConflictException(
        'Chỉ có thể đánh giá sau khi hoàn thành bữa ăn (booking COMPLETED)',
      );
    }

    // Kiểm tra booking chưa được review (tránh duplicate trước khi hit unique index)
    const existingReview = await this.reviewModel.findOne({
      bookingId: new Types.ObjectId(dto.bookingId),
    });

    if (existingReview) {
      throw new ConflictException('Booking này đã được đánh giá trước đó');
    }

    // Tạo review
    const review = await this.reviewModel.create({
      bookingId: new Types.ObjectId(dto.bookingId),
      userId: new Types.ObjectId(userId),
      restaurantId: booking.restaurantId,
      rating: dto.rating,
      comment: dto.comment,
      images: dto.images ?? [],
    });

    // Cập nhật lại rating trung bình của nhà hàng
    await this.recalculateRestaurantRating(
      (booking.restaurantId as any)?._id?.toString() ??
        booking.restaurantId.toString(),
    );

    return review;
  }

  // ===========================================================
  // READ
  // ===========================================================

  async getReviews(query: QueryReviewDto) {
    const { currentPage, pageSize, skip } = buildPagination({
      currentPage: query.currentPage,
      pageSize: query.pageSize,
    });

    const filter: Record<string, any> = {};

    if (query.restaurantId) {
      if (!Types.ObjectId.isValid(query.restaurantId)) {
        throw new BadRequestException('Định dạng ID nhà hàng không hợp lệ');
      }
      filter.restaurantId = new Types.ObjectId(query.restaurantId);
    }

    if (query.rating) {
      filter.rating = query.rating;
    }

    const [reviews, totalItems] = await Promise.all([
      this.reviewModel
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(pageSize)
        .populate({
          path: 'userId',
          select: 'name avatar',
        })
        .lean(),
      this.reviewModel.countDocuments(filter),
    ]);

    return {
      data: reviews,
      meta: {
        currentPage,
        pageSize,
        totalItems,
        totalPages: Math.ceil(totalItems / pageSize),
      },
    };
  }

  async getMyReviews(userId: string, query: QueryReviewDto) {
    if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestException('Định dạng ID người dùng không hợp lệ');
    }

    const { currentPage, pageSize, skip } = buildPagination({
      currentPage: query.currentPage,
      pageSize: query.pageSize,
    });

    const filter: Record<string, any> = {
      userId: new Types.ObjectId(userId),
    };

    if (query.rating) {
      filter.rating = query.rating;
    }

    const [reviews, totalItems] = await Promise.all([
      this.reviewModel
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(pageSize)
        .populate({
          path: 'restaurantId',
          select: 'restaurantName avatar slug',
        })
        .lean(),
      this.reviewModel.countDocuments(filter),
    ]);

    return {
      data: reviews,
      meta: {
        currentPage,
        pageSize,
        totalItems,
        totalPages: Math.ceil(totalItems / pageSize),
      },
    };
  }

  async getReviewById(reviewId: string) {
    if (!Types.ObjectId.isValid(reviewId)) {
      throw new BadRequestException('Định dạng ID review không hợp lệ');
    }

    const review = await this.reviewModel
      .findById(reviewId)
      .populate({ path: 'userId', select: 'name avatar' })
      .populate({ path: 'restaurantId', select: 'restaurantName avatar slug' })
      .lean();

    if (!review) {
      throw new NotFoundException('Không tìm thấy đánh giá');
    }

    return review;
  }

  // ===========================================================
  // UPDATE
  // ===========================================================

  async updateReview(reviewId: string, userId: string, dto: UpdateReviewDto) {
    if (!Types.ObjectId.isValid(reviewId)) {
      throw new BadRequestException('Định dạng ID review không hợp lệ');
    }

    const review = await this.reviewModel.findById(reviewId);

    if (!review) {
      throw new NotFoundException('Không tìm thấy đánh giá');
    }

    // Kiểm tra quyền sở hữu
    if (review.userId.toString() !== userId) {
      throw new ForbiddenException('Bạn không có quyền chỉnh sửa đánh giá này');
    }

    // Nếu thay đổi danh sách ảnh → xóa ảnh cũ trên Cloudinary
    if (dto.images !== undefined) {
      const oldPublicIds = review.images
        .map((img) => img.publicId)
        .filter(Boolean);

      if (oldPublicIds.length > 0) {
        try {
          await this.uploadService.deleteImages(oldPublicIds);
        } catch (error) {
          this.logger.warn(
            `Failed to delete old review images: ${error instanceof Error ? error.message : error}`,
          );
        }
      }

      review.images = dto.images;
    }

    if (dto.rating !== undefined) {
      review.rating = dto.rating;
    }

    if (dto.comment !== undefined) {
      review.comment = dto.comment;
    }

    await review.save();

    // Recalculate rating nếu rating thay đổi
    if (dto.rating !== undefined) {
      await this.recalculateRestaurantRating(review.restaurantId.toString());
    }

    return review;
  }

  // ===========================================================
  // DELETE
  // ===========================================================

  async deleteReview(reviewId: string, userId: string, role: UserRole) {
    if (!Types.ObjectId.isValid(reviewId)) {
      throw new BadRequestException('Định dạng ID review không hợp lệ');
    }

    const review = await this.reviewModel.findById(reviewId);

    if (!review) {
      throw new NotFoundException('Không tìm thấy đánh giá');
    }

    // Kiểm tra quyền: ADMIN bypass, CUSTOMER phải là chủ sở hữu
    if (role !== UserRole.ADMIN && review.userId.toString() !== userId) {
      throw new ForbiddenException('Bạn không có quyền xóa đánh giá này');
    }

    // Xóa ảnh trên Cloudinary
    const publicIds = review.images.map((img) => img.publicId).filter(Boolean);

    if (publicIds.length > 0) {
      try {
        await this.uploadService.deleteImages(publicIds);
      } catch (error) {
        this.logger.warn(
          `Failed to delete review images on Cloudinary: ${error instanceof Error ? error.message : error}`,
        );
      }
    }

    const restaurantId = review.restaurantId.toString();

    await review.deleteOne();

    // Recalculate rating sau khi xóa review
    await this.recalculateRestaurantRating(restaurantId);

    return { message: 'Xóa đánh giá thành công' };
  }

  // ===========================================================
  // RESTAURANT REPLY
  // ===========================================================

  async replyReview(
    reviewId: string,
    restaurantUserId: string,
    dto: ReplyReviewDto,
  ) {
    if (!Types.ObjectId.isValid(reviewId)) {
      throw new BadRequestException('Định dạng ID review không hợp lệ');
    }

    const review = await this.reviewModel.findById(reviewId);

    if (!review) {
      throw new NotFoundException('Không tìm thấy đánh giá');
    }

    // Kiểm tra review thuộc nhà hàng của user đang đăng nhập
    const restaurant =
      await this.restaurantsService.getRestaurantByUserId(restaurantUserId);

    if (review.restaurantId.toString() !== restaurant._id.toString()) {
      throw new ForbiddenException(
        'Bạn không có quyền phản hồi đánh giá này',
      );
    }

    review.restaurantReply = {
      content: dto.content,
      repliedAt: new Date(),
    };

    await review.save();

    return review;
  }

  async deleteReply(reviewId: string, restaurantUserId: string) {
    if (!Types.ObjectId.isValid(reviewId)) {
      throw new BadRequestException('Định dạng ID review không hợp lệ');
    }

    const review = await this.reviewModel.findById(reviewId);

    if (!review) {
      throw new NotFoundException('Không tìm thấy đánh giá');
    }

    const restaurant =
      await this.restaurantsService.getRestaurantByUserId(restaurantUserId);

    if (review.restaurantId.toString() !== restaurant._id.toString()) {
      throw new ForbiddenException(
        'Bạn không có quyền xóa phản hồi đánh giá này',
      );
    }

    if (!review.restaurantReply) {
      throw new BadRequestException('Đánh giá này chưa có phản hồi từ nhà hàng');
    }

    review.restaurantReply = null;

    await review.save();

    return { message: 'Xóa phản hồi thành công' };
  }

  // ===========================================================
  // PRIVATE HELPER
  // ===========================================================

  private async recalculateRestaurantRating(restaurantId: string) {
    const result = await this.reviewModel.aggregate<{
      avgRating: number;
      total: number;
    }>([
      { $match: { restaurantId: new Types.ObjectId(restaurantId) } },
      {
        $group: {
          _id: null,
          avgRating: { $avg: '$rating' },
          total: { $sum: 1 },
        },
      },
    ]);

    const avgRating = result[0]?.avgRating ?? 0;

    // Làm tròn 1 chữ số thập phân (vd: 4.3, 3.7)
    const rounded = Math.round(avgRating * 10) / 10;

    try {
      await this.restaurantsService.updateRating(restaurantId, rounded);
    } catch (error) {
      this.logger.warn(
        `Failed to update restaurant rating: ${error instanceof Error ? error.message : error}`,
      );
    }
  }
}
