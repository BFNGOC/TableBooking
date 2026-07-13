import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '@app/modules/users/users.service';
import { comparePasswordHelper } from '@app/helpers/util';
import { JwtService } from '@nestjs/jwt/dist/jwt.service';
import { UserDocument } from '@app/modules/users/schemas/user.schema';
import { CreateAuthDto } from './dto/create-auth.dto';
import { CheckCodeDto } from './dto/check-code.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { GoogleLoginDto } from './dto/google-login.dto';
import { OAuth2Client } from 'google-auth-library';

@Injectable()
export class AuthService {
  private readonly googleClient = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
  );

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
    const ticket = await this.googleClient.verifyIdToken({
      idToken: googleLoginDto.idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload?.email) {
      throw new UnauthorizedException('Google token không hợp lệ');
    }

    const user = await this.usersService.findOrCreateGoogleUser({
      email: payload.email,
      name: payload.name ?? payload.email,
      avatar: payload.picture,
      googleId: payload.sub,
    });

    await this.usersService.updateLastLogin(user._id.toString());

    const jwtPayload = { email: user.email, sub: user._id, role: user.role };

    return {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        accountType: user.accountType,
      },
      access_token: this.jwtService.sign(jwtPayload),
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
