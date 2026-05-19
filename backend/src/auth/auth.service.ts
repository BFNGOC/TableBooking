import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '@app/modules/users/users.service';
import { comparePasswordHelper } from '@app/helpers/util';
import { JwtService } from '@nestjs/jwt/dist/jwt.service';
import { UserDocument } from '@app/modules/users/schemas/user.schema';
import { CreateAuthDto } from './dto/create-auth.dto';

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
    const user = await this.usersService.findByEmail(email);

    if (!user.password) {
      throw new UnauthorizedException('Password không được để trống');
    }

    const isPasswordValid = await comparePasswordHelper(pass, user.password);

    if (!isPasswordValid || !user) return null;

    return user;
  }

  login(user: UserDocument) {
    const payload = { email: user.email, sub: user._id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(registerDto: CreateAuthDto) {
    return this.usersService.handleRegister(registerDto);
  }
}
