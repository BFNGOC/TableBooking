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
  RestaurantDocument,
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
import { VerifyStatusCountAggregate } from './types/restaurant-types';
import { TaxService } from '../tax/tax.service';
import { UserDocument, UserRole } from '../users/schemas/user.schema';
import { UsersService } from '../users/users.service';
import { UserSearchService } from '../users/user-search.service';
import { UpdateRestaurantOnboardingDto } from './dto/update-restaurant-onboarding.dto';

@Injectable()
export class RestaurantsService {
  constructor(
    @InjectModel(Restaurant.name)
    private restaurantModel: Model<Restaurant>,
    private readonly mailerService: MailerService,
    private readonly restaurantSearchService: RestaurantSearchService,
    private readonly counterService: CounterService,
    private readonly taxService: TaxService,
    private readonly usersService: UsersService,
    private readonly userSearchService: UserSearchService,
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

  async getVerifyStatusCount() {
    const result =
      await this.restaurantModel.aggregate<VerifyStatusCountAggregate>([
        {
          $group: {
            _id: '$verifyStatus',
            count: {
              $sum: 1,
            },
          },
        },
      ]);

    const response = {
      total: 0,

      emailPending: 0,

      pending: 0,

      approved: 0,

      rejected: 0,
    };

    result.forEach((item) => {
      response.total += item.count;

      switch (item._id) {
        case RestaurantVerifyStatus.EMAIL_PENDING:
          response.emailPending = item.count;
          break;

        case RestaurantVerifyStatus.PENDING:
          response.pending = item.count;
          break;

        case RestaurantVerifyStatus.APPROVED:
          response.approved = item.count;
          break;

        case RestaurantVerifyStatus.REJECTED:
          response.rejected = item.count;
          break;
      }
    });

    return response;
  }

  async getAdminDetail(id: string) {
    const restaurant = await this.restaurantModel
      .findById(id)
      .populate({
        path: 'userId',
        select: 'name email phone avatar',
      })
      .lean();

    if (!restaurant) {
      throw new NotFoundException('Không tìm thấy nhà hàng');
    }

    // onboarding chưa hoàn thành
    if (
      restaurant.verifyStatus === RestaurantVerifyStatus.EMAIL_PENDING ||
      restaurant.verifyStatus === RestaurantVerifyStatus.PENDING
    ) {
      return {
        type: 'ONBOARDING',
        data: {
          _id: restaurant._id,

          restaurantCode: restaurant.restaurantCode,

          restaurantName: restaurant.restaurantName,

          verifyStatus: restaurant.verifyStatus,

          verifyNote: restaurant.verifyNote,

          taxCode: restaurant.taxCode,

          representativeName: restaurant.representativeName,

          status: restaurant.status,

          address: restaurant.address,

          email: restaurant.email,

          phone: restaurant.phone,

          onboardingRequestedAt: restaurant.onboardingRequestedAt,

          user: restaurant.userId,
        },
      };
    }

    return {
      type: 'RESTAURANT',
      data: restaurant,
    };
  }

  async verifyTaxCode(restaurantId: string) {
    // 1. Tìm restaurant
    const restaurant = await this.restaurantModel.findById(restaurantId);

    if (!restaurant) {
      throw new NotFoundException('Không tìm thấy nhà hàng');
    }

    // 2. Lấy MST nhà hàng đã đăng ký
    const taxCode = restaurant.taxCode;

    if (!taxCode) {
      throw new BadRequestException('Nhà hàng chưa cung cấp mã số thuế');
    }

    // 3. Gọi API bên thứ 3
    const company = await this.taxService.getCompanyByTaxCode(taxCode);

    // 4. Kiểm tra MST trả về có trùng không
    const isTaxCodeMatched = company.mst === taxCode;

    // 5. Kiểm tra trạng thái doanh nghiệp
    const isActive = company.status === 'active';

    // 6. Trả kết quả
    return {
      isValid: isTaxCodeMatched && isActive,

      isTaxCodeMatched,

      isActive,

      restaurant: {
        restaurantName: restaurant.restaurantName,

        taxCode: restaurant.taxCode,

        address: restaurant.address,
      },

      company: {
        mst: company.mst,

        nameVi: company.name_vi,

        nameEn: company.name_en,

        legalForm: company.legal_form,

        status: company.status,

        addressFull: company.address_full,

        legalRepName: company.legal_rep_name,

        province: company.province?.name_vi ?? null,

        district: company.district?.name_vi ?? null,

        industry: company.industry?.name_vi ?? null,
      },
    };
  }

  async approveRestaurant(restaurantId: string) {
    const session = await this.restaurantModel.db.startSession();

    try {
      let restaurant: RestaurantDocument;
      let user: UserDocument;

      await session.withTransaction(async () => {
        const foundRestaurant = await this.restaurantModel
          .findById(restaurantId)
          .session(session)
          .exec();

        if (!foundRestaurant) {
          throw new NotFoundException('Không tìm thấy nhà hàng');
        }

        if (foundRestaurant.verifyStatus !== RestaurantVerifyStatus.PENDING) {
          throw new BadRequestException(
            'Nhà hàng không ở trạng thái chờ phê duyệt',
          );
        }

        foundRestaurant.verifyStatus = RestaurantVerifyStatus.APPROVED;

        await foundRestaurant.save({
          session,
        });

        restaurant = foundRestaurant;

        user = await this.usersService.changeRole(
          foundRestaurant.userId.toString(),
          UserRole.RESTAURANT,
          session,
        );
      });

      await this.restaurantSearchService.update(restaurant!);

      await this.userSearchService.update(user!);

      return true;
    } finally {
      await session.endSession();
    }
  }

  async rejectRestaurant(
    restaurantId: string,
    reason: string,
  ): Promise<{ success: boolean }> {
    const restaurant = await this.restaurantModel.findById(restaurantId).exec();

    if (!restaurant) {
      throw new NotFoundException('Không tìm thấy nhà hàng');
    }

    if (restaurant.verifyStatus !== RestaurantVerifyStatus.PENDING) {
      throw new BadRequestException(
        'Nhà hàng không ở trạng thái chờ phê duyệt',
      );
    }

    restaurant.verifyStatus = RestaurantVerifyStatus.REJECTED;

    restaurant.verifyNote = reason;

    await restaurant.save();

    await this.restaurantSearchService.update(restaurant);

    return {
      success: true,
    };
  }

  async updateOnboarding(
    userId: string,
    dto: UpdateRestaurantOnboardingDto,
  ): Promise<RestaurantDocument> {
    const restaurant = await this.restaurantModel.findOne({ userId }).exec();

    if (!restaurant) {
      throw new NotFoundException(
        'Không tìm thấy thông tin đăng ký nhà hàng của bạn',
      );
    }

    if (restaurant.verifyStatus !== RestaurantVerifyStatus.REJECTED) {
      throw new BadRequestException(
        'Bạn chỉ có thể chỉnh sửa hồ sơ khi yêu cầu bị từ chối phê duyệt',
      );
    }

    Object.assign(restaurant, dto);

    restaurant.verifyStatus = RestaurantVerifyStatus.PENDING;
    restaurant.onboardingRequestedAt = new Date();

    await restaurant.save();

    await this.restaurantSearchService.update(restaurant);

    return restaurant;
  }

  //to-do
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
