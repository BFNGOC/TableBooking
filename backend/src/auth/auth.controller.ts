import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserDocument } from '@app/modules/users/schemas/user.schema';
import { LocalAuthGuard } from './passport/local-auth.guard';
import { Public, ResponseMessage } from '@app/decorator/customize';
import { CreateAuthDto } from './dto/create-auth.dto';
import { CheckCodeDto } from './dto/check-code.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { GoogleLoginDto } from './dto/google-login.dto';
import { Throttle } from '@nestjs/throttler';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @Public()
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @UseGuards(LocalAuthGuard)
  @ResponseMessage('Đăng nhập thành công')
  handleLogin(@Request() req: { user: UserDocument }) {
    return this.authService.login(req.user);
  }

  @Post('register')
  @Public()
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @ResponseMessage('Đăng ký thành công')
  register(@Body() registerDto: CreateAuthDto) {
    return this.authService.register(registerDto);
  }

  @Post('google')
  @Public()
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @ResponseMessage('Đăng nhập Google thành công')
  loginWithGoogle(@Body() googleLoginDto: GoogleLoginDto) {
    return this.authService.loginWithGoogle(googleLoginDto);
  }

  @Post('verify')
  @Public()
  @Throttle({ default: { limit: 3, ttl: 60000 } })
  @ResponseMessage('Xác thực thành công')
  checkCode(@Body() checkCodeDto: CheckCodeDto) {
    return this.authService.checkCode(checkCodeDto);
  }

  @Post('retry-active')
  @Public()
  @Throttle({ default: { limit: 3, ttl: 60000 } })
  retryActive(@Body('email') email: string) {
    return this.authService.retryActive(email);
  }

  @Post('retry-password')
  @Public()
  @Throttle({ default: { limit: 3, ttl: 60000 } })
  retryPassword(@Body('email') email: string) {
    return this.authService.retryPassword(email);
  }

  @Post('change-password')
  @Public()
  @Throttle({ default: { limit: 3, ttl: 60000 } })
  changePassword(@Body() changePasswordDto: ChangePasswordDto) {
    return this.authService.changePassword(changePasswordDto);
  }
}
