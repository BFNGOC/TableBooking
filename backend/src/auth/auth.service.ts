import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '@app/modules/users/users.service';
import { comparePasswordHelper } from '@app/helpers/util';
import { JwtService } from '@nestjs/jwt/dist/jwt.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('User không tồn tại');
    }

    if (!user.password) {
      throw new UnauthorizedException('Password không được để trống');
    }

    const isPasswordValid = await comparePasswordHelper(pass, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Email hoặc mật khẩu không đúng');
    }

    const payload = { sub: user._id, email: user.email };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
