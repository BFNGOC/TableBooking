import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { RestaurantOnboardingDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantProfileDto } from './dto/update-restaurant.dto';
import {
  Restaurant,
  RestaurantVerifyStatus,
} from './schemas/restaurant.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CUISINE_TYPES } from '@app/shared/dto/constants/cuisine-type.constant';
import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';
import { RestaurantSearchService } from './restaurant-admin-search.service';
import { CounterService } from '../counter/counter.service';
import { MailerService } from '@nestjs-modules/mailer';
import { CheckCodeDto } from '@app/auth/dto/check-code.dto';
import { FindRestaurantAdminDto } from './dto/find-restaurant.dto';
import { buildPagination } from '@app/helpers/pagination.helper';
import { parseSort } from '@app/helpers/search-sort.util';

@Injectable()
export class RestaurantsService {
  constructor(
    @InjectModel(Restaurant.name)
    private restaurantModel: Model<Restaurant>,
    private readonly mailerService: MailerService,
    private readonly restaurantSearchService: RestaurantSearchService,
    private readonly counterService: CounterService,
  ) {}

  async reindexAll() {
    const restaurants = await this.restaurantModel.find();

    for (const restaurant of restaurants) {
      await this.restaurantSearchService.index(restaurant);
    }

    return {
      total: restaurants.length,
    };
  }

  getCuisineTypes() {
    return CUISINE_TYPES.map((item) => ({
      id: item,
      text: item,
    }));
  }

  /***********************************
   *  ME
   ***********************************/
  async getCurrentUserRestaurant(userId: string) {
    const restaurant = await this.restaurantModel.findOne({ userId });

    if (!restaurant) {
      throw new NotFoundException('Không tìm thấy nhà hàng của người dùng');
    }

    return restaurant;
  }

  /***********************************
   *  CUSTOMER
   ***********************************/
  async createOnboarding(
    userId: string,
    restaurantOnboardingDto: RestaurantOnboardingDto,
  ) {
    const isTaxCodeExists = await this.restaurantModel.findOne({
      taxCode: restaurantOnboardingDto.taxCode,
    });

    if (isTaxCodeExists) {
      throw new ConflictException(
        'Nhà hàng đã được đăng ký với mã số thuế này',
      );
    }

    const restaurantCode = await this.counterService.nextCode(
      'RES',
      'restaurant',
    );

    const codeId = uuidv4();

    const restaurant = await this.restaurantModel.create({
      ...restaurantOnboardingDto,
      verifyStatus: RestaurantVerifyStatus.EMAIL_PENDING,
      userId,
      verificationCodeId: codeId,
      verificationCodeExpires: dayjs().add(5, 'minute').toDate(),
      restaurantCode,
    });

    await this.restaurantSearchService.index(restaurant);

    //send email
    await this.mailerService.sendMail({
      to: restaurant.email,
      subject: 'Activate your restaurant at TableBooking',
      template: 'register',
      context: {
        name: restaurant?.restaurantName ?? restaurant.email,
        activationCode: codeId,
      },
    });

    return restaurant;
  }

  async handleverifyEmail(data: CheckCodeDto) {
    const restaurant = await this.restaurantModel.findOne({
      _id: data._id,
      verificationCodeId: data.code,
    });

    if (!restaurant) {
      throw new NotFoundException('Mã xác thực không hợp lệ');
    }

    if (restaurant.verifyStatus === RestaurantVerifyStatus.PENDING) {
      throw new BadRequestException('Tài khoản đã được kích hoạt');
    }

    if (dayjs().isAfter(restaurant.verificationCodeExpires)) {
      throw new BadRequestException('Mã xác thực đã hết hạn');
    }

    restaurant.verifyStatus = RestaurantVerifyStatus.PENDING;

    await restaurant.save();

    return {
      message: 'Kích hoạt tài khoản thành công',
    };
  }

  async resendEmail(email: string) {
    const restaurant = await this.restaurantModel.findOne({ email });

    if (!restaurant) {
      throw new NotFoundException('Tài khoản không tồn tại');
    }

    if (restaurant.verifyStatus === RestaurantVerifyStatus.PENDING) {
      throw new BadRequestException('Tài khoản đã được kích hoạt');
    }

    //update user
    const codeId = uuidv4();

    await restaurant.updateOne({
      verificationCodeId: codeId,
      verificationCodeExpires: dayjs().add(5, 'minute').toDate(),
    });

    //send email
    await this.mailerService.sendMail({
      to: restaurant.email,
      subject: 'Activate your account at TableBooking',
      template: 'register',
      context: {
        name: restaurant?.restaurantName ?? restaurant.email,
        activationCode: codeId,
      },
    });

    return { _id: restaurant?._id };
  }

  /***********************************
   *  ADMIN
   ***********************************/
  async findAll(query: FindRestaurantAdminDto) {
    const { currentPage, pageSize } = buildPagination({
      currentPage: query.currentPage,
      pageSize: query.pageSize,
    });

    const searchResult = await this.restaurantSearchService.search({
      keyword: query.keySearch,
      currentPage,
      pageSize,

      filter: {
        restaurantCode: query.restaurantCode,
        status: query.status,
        verifyStatus: query.verifyStatus,
        taxCode: query.taxCode,

        fromDate: query.fromDate,
        toDate: query.toDate,
      },

      sort: parseSort(query.sort),
    });

    return {
      data: searchResult.data,

      meta: {
        currentPage,
        pageSize,

        totalItems: searchResult.totalItems,

        totalPages: Math.ceil(searchResult.totalItems / pageSize),
      },
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} restaurant`;
  }

  async update(id: number, updateRestaurantDto: UpdateRestaurantProfileDto) {
    const restaurant = await this.restaurantModel.findByIdAndUpdate(
      id,
      updateRestaurantDto,
      { new: true },
    );

    if (restaurant) {
      await this.restaurantSearchService.update(restaurant);
    }

    return restaurant;
  }

  async remove(id: number) {
    const restaurant = await this.restaurantModel.findByIdAndDelete(id);

    if (restaurant) {
      await this.restaurantSearchService.delete(String(restaurant._id));
    }

    return restaurant;
  }
}
