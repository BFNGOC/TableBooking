import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '@app/modules/users/users.service';
import { comparePasswordHelper } from '@app/helpers/util';
import { JwtService } from '@nestjs/jwt/dist/jwt.service';
import { UserDocument } from '@app/modules/users/schemas/user.schema';
import { CreateAuthDto } from './dto/create-auth.dto';
import { CheckCodeDto } from './dto/check-code.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { GoogleLoginDto } from './dto/google-login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    email: string,
    pass: string,
  ): Promise<UserDocument | null> {
    const user = await this.usersService.findByEmailWithPassword(email);

    if (!user) {
      return null;
    }

    if (!user.password) {
      throw new UnauthorizedException('Password không được để trống.');
    }

    const isPasswordValid = await comparePasswordHelper(pass, user.password);

    if (!isPasswordValid) {
      return null;
    }

    // Cập nhật thời gian đăng nhập
    await this.usersService.updateLastLogin(user._id.toString());

    return user;
  }

  login(user: UserDocument) {
    const payload = { email: user.email, sub: user._id, role: user.role };

    return {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      access_token: this.jwtService.sign(payload),
    };
  }

  async loginWithGoogle(googleLoginDto: GoogleLoginDto) {
    const user = await this.usersService.findOrCreateGoogleUser(googleLoginDto);

    await this.usersService.updateLastLogin(user._id.toString());

    const payload = { email: user.email, sub: user._id, role: user.role };

    return {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        accountType: user.accountType,
      },
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(registerDto: CreateAuthDto) {
    return this.usersService.handleRegister(registerDto);
  }

  async checkCode(data: CheckCodeDto) {
    return this.usersService.handleActive(data);
  }

  async retryActive(email: string) {
    return this.usersService.retryActive(email);
  }

  async retryPassword(email: string) {
    return this.usersService.retryPassword(email);
  }

  async changePassword(data: ChangePasswordDto) {
    return this.usersService.changePassword(data);
  }
}
