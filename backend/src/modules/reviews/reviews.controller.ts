import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { QueryReviewDto } from './dto/query-review.dto';
import { ReplyReviewDto } from './dto/reply-review.dto';
import { CurrentUser } from '@app/decorator/current-user.decorator';
import type { AuthUser } from '@app/auth/types/auth-jwt-user.type';
import { Public, ResponseMessage } from '@app/decorator/customize';
import { Roles } from '@app/decorator/roles.decorator';
import { UserRole } from '../users/schemas/user.schema';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  // ─── CREATE ────────────────────────────────────────────────

  @Post()
  @ResponseMessage('Đánh giá thành công')
  createReview(
    @CurrentUser() user: AuthUser,
    @Body() dto: CreateReviewDto,
  ) {
    return this.reviewsService.createReview(user._id, dto);
  }

  // ─── READ ──────────────────────────────────────────────────

  @Get()
  @Public()
  getReviews(
    @Query() query: QueryReviewDto,
  ) {
    return this.reviewsService.getReviews(query);
  }

  @Get('me')
  getMyReviews(
    @CurrentUser() user: AuthUser,
    @Query() query: QueryReviewDto,
  ) {
    return this.reviewsService.getMyReviews(user._id, query);
  }

  @Get(':id')
  @Public()
  getReviewById(@Param('id') id: string) {
    return this.reviewsService.getReviewById(id);
  }

  // ─── UPDATE ────────────────────────────────────────────────

  @Patch(':id')
  updateReview(
    @Param('id') id: string,
    @CurrentUser() user: AuthUser,
    @Body() dto: UpdateReviewDto,
  ) {
    return this.reviewsService.updateReview(id, user._id, dto);
  }

  // ─── DELETE ────────────────────────────────────────────────

  @Delete(':id')
  @Roles(UserRole.CUSTOMER, UserRole.ADMIN)
  deleteReview(
    @Param('id') id: string,
    @CurrentUser() user: AuthUser,
  ) {
    return this.reviewsService.deleteReview(id, user._id, user.role);
  }

  // ─── RESTAURANT REPLY ──────────────────────────────────────

  @Post(':id/reply')
  @Roles(UserRole.RESTAURANT)
  @ResponseMessage('Phản hồi đánh giá thành công')
  replyReview(
    @Param('id') id: string,
    @CurrentUser() user: AuthUser,
    @Body() dto: ReplyReviewDto,
  ) {
    return this.reviewsService.replyReview(id, user._id, dto);
  }

  @Delete(':id/reply')
  @Roles(UserRole.RESTAURANT)
  @ResponseMessage('Xóa phản hồi thành công')
  deleteReply(
    @Param('id') id: string,
    @CurrentUser() user: AuthUser,
  ) {
    return this.reviewsService.deleteReply(id, user._id);
  }
}
