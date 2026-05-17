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

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
  ) {}

  async isEmailExist(email: string): Promise<boolean> {
    const user = await this.userModel.exists({ email });
    if (user) return true;
    return false;
  }

  async register(createUserDto: CreateUserDto) {
    const { email, name, password, phone, address, avatar } = createUserDto;

    const isEmailExist = await this.isEmailExist(email);

    if (isEmailExist) {
      throw new ConflictException(`Email đã tồn tại: ${email}`);
    }

    if (!password) {
      throw new BadRequestException('Password không được để trống');
    }

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
}
