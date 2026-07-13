import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserDocument } from '@app/modules/users/schemas/user.schema';
import { LocalAuthGuard } from './passport/local-auth.guard';
import { Public, ResponseMessage } from '@app/decorator/customize';
import { CreateAuthDto } from './dto/create-auth.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { CheckCodeDto } from './dto/check-code.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { GoogleLoginDto } from './dto/google-login.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly mailerService: MailerService,
  ) {}

  @Post('login')
  @Public()
  @UseGuards(LocalAuthGuard)
  @ResponseMessage('Đăng nhập thành công')
  handleLogin(@Request() req: { user: UserDocument }) {
    return this.authService.login(req.user);
  }

  @Post('register')
  @Public()
  @ResponseMessage('Đăng ký thành công')
  register(@Body() registerDto: CreateAuthDto) {
    return this.authService.register(registerDto);
  }

  @Post('google')
  @Public()
  @ResponseMessage('Đăng nhập Google thành công')
  loginWithGoogle(@Body() googleLoginDto: GoogleLoginDto) {
    return this.authService.loginWithGoogle(googleLoginDto);
  }

  @Post('verify')
  @Public()
  @ResponseMessage('Xác thực thành công')
  checkCode(@Body() checkCodeDto: CheckCodeDto) {
    return this.authService.checkCode(checkCodeDto);
  }

  @Post('retry-active')
  @Public()
  retryActive(@Body('email') email: string) {
    return this.authService.retryActive(email);
  }

  @Post('retry-password')
  @Public()
  retryPassword(@Body('email') email: string) {
    return this.authService.retryPassword(email);
  }

  @Post('change-password')
  @Public()
  changePassword(@Body() changePasswordDto: ChangePasswordDto) {
    return this.authService.changePassword(changePasswordDto);
  }

  @Get('mail')
  @Public()
  async testMail() {
    await this.mailerService.sendMail({
      to: 'thengoc041012@gmail.com',
      subject: 'Welcome!',
      text: 'welcome',
      template: 'register',
      context: {
        name: 'BFNGOC',
        activationCode: 'cf1a3f828287',
      },
    });

    return 'ok';
  }
}
