import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose/dist/common/mongoose.decorators';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { hashPasswordHelper, validateMongoId } from '@app/helpers/util';
import aqp from 'api-query-params';
import { CreateAuthDto } from '@app/auth/dto/create-auth.dto';
import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private readonly mailerService: MailerService,
  ) {}

  async isEmailExist(email: string): Promise<boolean> {
    const user = await this.userModel.exists({ email });
    if (user) return true;
    return false;
  }

  async create(createUserDto: CreateUserDto) {
    const { email, name, password, phone, address, avatar } = createUserDto;

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
      phone,
      address,
      avatar,
    });

    return {
      message: 'Tạo user thành công',
      data: {
        _id: createdUser._id,
      },
    };
  }

  async findAll(query: Record<string, any>, current = 1, pageSize = 10) {
    const { filter, sort } = aqp(query);

    delete filter.current;
    delete filter.pageSize;

    current = current > 0 ? current : 1;

    pageSize = pageSize > 0 ? pageSize : 10;

    const totalItems = await this.userModel.countDocuments(filter);

    const totalPages = Math.ceil(totalItems / pageSize);

    const skip = (current - 1) * pageSize;

    const usersResult = await this.userModel
      .find(filter)
      .skip(skip)
      .limit(pageSize)
      .select('-password')
      .sort(sort as Record<string, 1 | -1>);

    return {
      message: 'Lấy danh sách user thành công',

      data: usersResult,

      meta: {
        current,
        pageSize,
        totalPages,
        totalItems,
      },
    };
  }

  async findOne(_id: string) {
    validateMongoId(_id);

    const user = await this.userModel.findById(_id).select('-password');

    if (!user) {
      throw new NotFoundException('User không tồn tại');
    }

    return {
      message: 'Lấy user thành công',
      data: user,
    };
  }

  async findByEmail(email: string) {
    const user = await this.userModel.findOne({ email });

    if (!user) {
      throw new NotFoundException('User không tồn tại');
    }

    return user;
  }

  async update(updateUserDto: UpdateUserDto) {
    const { _id, name, phone, address, avatar } = updateUserDto;

    const updatedUser = await this.userModel
      .findByIdAndUpdate(
        _id,
        {
          name,
          phone,
          address,
          avatar,
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
      message: 'Tạo user thành công',
      data: {
        _id: user._id,
      },
    };
  }
}
