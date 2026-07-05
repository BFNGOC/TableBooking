import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose/dist/common/mongoose.decorators';
import { User, UserDocument } from './schemas/user.schema';
import { Model } from 'mongoose';
import { hashPasswordHelper, validateMongoId } from '@app/helpers/util';
import { CreateAuthDto } from '@app/auth/dto/create-auth.dto';
import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';
import { MailerService } from '@nestjs-modules/mailer';
import { CheckCodeDto } from '@app/auth/dto/check-code.dto';
import { ChangePasswordDto } from '@app/auth/dto/change-password.dto';
import { FindUserDto } from './dto/find-user.dto';
import { buildPagination } from '@app/helpers/pagination.helper';
import { buildSort } from '@app/helpers/sort.helper';
import { normalizeKeyword } from '@app/helpers/string.helper';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private readonly mailerService: MailerService,
  ) {}

  /*************************************************************
   * HELPERS
   *************************************************************/
  async getUserByIdOrThrow(
    userId: string,
    isSelectFull = false,
  ): Promise<UserDocument> {
    const query = this.userModel.findById(userId);

    if (isSelectFull) {
      query.select('+password +refreshToken');
    }

    const user = await query.exec();

    if (!user) {
      throw new NotFoundException('Không tìm thấy người dùng');
    }

    return user;
  }

  async isEmailExist(email: string, userId?: string): Promise<boolean> {
    const user = await this.userModel.findOne({ email });

    if (!user) {
      return false;
    }

    if (userId && user._id.toString() === userId) {
      return false;
    }

    return true;
  }

  /*************************************************************
   * USER
   *************************************************************/
  async getMe(userId: string) {
    const user = await this.getUserByIdOrThrow(userId);

    return {
      user,
    };
  }

  async updateMe(userId: string, dto: UpdateUserDto) {
    await this.getUserByIdOrThrow(userId);

    if (dto.email) {
      await this.isEmailExist(dto.email, userId);
    }

    const updatedUser = await this.userModel.findByIdAndUpdate(
      userId,
      {
        $set: {
          name: dto.name,
          email: dto.email,
          phone: dto.phone,
          address: dto.address,
          avatar: dto.avatar,
          gender: dto.gender,
          dateOfBirth: dto.dateOfBirth ? new Date(dto.dateOfBirth) : undefined,
        },
      },
      {
        new: true,
      },
    );

    return {
      user: updatedUser,
    };
  }

  /*************************************************************
   * ADMIN
   *************************************************************/
  async create(createUserDto: CreateUserDto) {
    const { email, name, password } = createUserDto;

    //check email
    const isEmailExist = await this.isEmailExist(email);

    if (isEmailExist) {
      throw new ConflictException(`Email đã tồn tại: ${email}`);
    }

    if (!password) {
      throw new BadRequestException('Password không được để trống');
    }

    //hash password
    const hashedPassword = await hashPasswordHelper(password);

    const createdUser = await this.userModel.create({
      email,
      name,
      password: hashedPassword,
    });

    return {
      message: 'Tạo user thành công',
      data: {
        _id: createdUser._id,
      },
    };
  }

  async findAll(query: FindUserDto) {
    const filter: Record<string, any> = {};

    if (query.role) {
      filter.role = query.role;
    }

    if (query.isActive !== undefined) {
      filter.isActive = query.isActive;
    }

    const keyword = normalizeKeyword(query.keySearch);

    if (keyword) {
      filter.$or = [
        {
          nameSearch: {
            $regex: keyword,
            $options: 'i',
          },
        },
        {
          emailSearch: {
            $regex: keyword,
            $options: 'i',
          },
        },
      ];
    }

    const { currentPage, pageSize, skip } = buildPagination({
      currentPage: query.currentPage,
      pageSize: query.pageSize,
    });

    const sort = buildSort(query.sort);

    const totalItems = await this.userModel.countDocuments(filter);

    const users = await this.userModel
      .find(filter)
      .collation({
        locale: 'vi',
        strength: 1,
      })
      .sort(sort)
      .skip(skip)
      .limit(pageSize);

    return {
      data: users,
      meta: {
        currentPage,
        pageSize,
        totalItems,
        totalPages: Math.ceil(totalItems / pageSize),
      },
    };
  }

  async findOne(_id: string) {
    validateMongoId(_id);

    const user = await this.userModel.findById(_id);

    if (!user) {
      throw new NotFoundException('User không tồn tại');
    }

    return {
      user,
    };
  }

  async findByEmail(email: string) {
    const user = await this.userModel.findOne({ email });

    if (!user) {
      throw new NotFoundException('User không tồn tại');
    }

    return user;
  }

  async findByEmailWithPassword(email: string) {
    return this.userModel.findOne({ email }).select('+password');
  }

  async update(updateUserDto: UpdateUserDto) {
    const { name } = updateUserDto;

    const updatedUser = await this.userModel
      .findByIdAndUpdate(
        {
          name,
        },
        {
          new: true,
        },
      )
      .select('-password');

    if (!updatedUser) {
      throw new NotFoundException('User không tồn tại');
    }

    return {
      message: 'Cập nhật user thành công',
      data: updatedUser,
    };
  }

  async remove(_id: string) {
    validateMongoId(_id);

    const deletedUser = await this.userModel.findByIdAndDelete(_id);

    if (!deletedUser) {
      throw new NotFoundException('User không tồn tại');
    }

    return {
      message: 'Xóa user thành công',
      data: deletedUser,
    };
  }

  async updateLastLogin(id: string) {
    await this.userModel.findByIdAndUpdate(id, {
      lastLoginAt: new Date(),
    });
  }

  async handleRegister(registerDto: CreateAuthDto) {
    const { email, name, password } = registerDto;

    //check email
    const isEmailExist = await this.isEmailExist(email);

    if (isEmailExist) {
      throw new ConflictException(`Email đã tồn tại: ${email}`);
    }

    if (!password) {
      throw new BadRequestException('Password không được để trống');
    }

    //hash password
    const hashedPassword = await hashPasswordHelper(password);

    const codeId = uuidv4();

    const user = await this.userModel.create({
      email,
      name,
      password: hashedPassword,
      isActive: false,
      verificationCodeId: codeId,
      verificationCodeExpires: dayjs().add(5, 'minute').toDate(),
    });

    //send email
    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Activate your account at TableBooking',
      template: 'register',
      context: {
        name: user?.name ?? user.email,
        activationCode: codeId,
      },
    });
    return {
      user: {
        _id: user._id,
      },
    };
  }

  async handleActive(data: CheckCodeDto) {
    const user = await this.userModel.findOne({
      _id: data._id,
      verificationCodeId: data.code,
    });

    if (!user) {
      throw new NotFoundException('Mã xác thực không hợp lệ');
    }

    if (user.isActive) {
      throw new BadRequestException('Tài khoản đã được kích hoạt');
    }

    if (dayjs().isAfter(user.verificationCodeExpires)) {
      throw new BadRequestException('Mã xác thực đã hết hạn');
    }

    user.isActive = true;

    await user.save();

    return {
      message: 'Kích hoạt tài khoản thành công',
    };
  }

  async retryActive(email: string) {
    const user = await this.userModel.findOne({ email });

    if (!user) {
      throw new NotFoundException('Tài khoản không tồn tại');
    }

    if (user.isActive) {
      throw new BadRequestException('Tài khoản đã được kích hoạt');
    }

    //update user
    const codeId = uuidv4();

    await user.updateOne({
      verificationCodeId: codeId,
      verificationCodeExpires: dayjs().add(5, 'minute').toDate(),
    });

    //send email
    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Activate your account at TableBooking',
      template: 'register',
      context: {
        name: user?.name ?? user.email,
        activationCode: codeId,
      },
    });

    return { _id: user?._id };
  }

  async retryPassword(email: string) {
    const user = await this.userModel.findOne({ email });

    if (!user) {
      throw new NotFoundException('Tài khoản không tồn tại');
    }

    //update user
    const codeId = uuidv4();

    await user.updateOne({
      verificationCodeId: codeId,
      verificationCodeExpires: dayjs().add(5, 'minute').toDate(),
    });

    //send email
    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Change your password account at TableBooking',
      template: 'register',
      context: {
        name: user?.name ?? user.email,
        activationCode: codeId,
      },
    });

    return { _id: user?._id, email: user?.email };
  }

  async changePassword(data: ChangePasswordDto) {
    if (data.password !== data.confirmPassword) {
      throw new BadRequestException('Mật khẩu/xác nhận mật khẩu không hợp lệ');
    }

    const user = await this.userModel.findOne({ email: data.email });

    if (!user) {
      throw new NotFoundException('Tài khoản không tồn tại');
    }

    if (dayjs().isAfter(user.verificationCodeExpires)) {
      throw new BadRequestException('Mã xác thực đã hết hạn');
    }

    user.password = await hashPasswordHelper(data.password);

    await user.save();

    //update user
    const codeId = uuidv4();

    await user.updateOne({
      verificationCodeId: codeId,
      verificationCodeExpires: dayjs().add(5, 'minute').toDate(),
    });

    //send email
    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Change your password account at TableBooking',
      template: 'register',
      context: {
        name: user?.name ?? user.email,
        activationCode: codeId,
      },
    });

    return { _id: user?._id, email: user?.email };
  }
}
