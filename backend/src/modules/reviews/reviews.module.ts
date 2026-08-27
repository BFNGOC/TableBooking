import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import { Review, ReviewSchema } from './schemas/review.schema';
import { BookingsModule } from '../bookings/bookings.module';
import { RestaurantsModule } from '../restaurants/restaurants.module';
import { UploadModule } from '../upload/upload.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Review.name, schema: ReviewSchema }]),
    BookingsModule,      // Cung cấp BookingsService
    RestaurantsModule,   // Cung cấp RestaurantsService
    UploadModule,        // Cung cấp UploadService để xóa ảnh Cloudinary
  ],
  controllers: [ReviewsController],
  providers: [ReviewsService],
  exports: [ReviewsService],
})
export class ReviewsModule {}
