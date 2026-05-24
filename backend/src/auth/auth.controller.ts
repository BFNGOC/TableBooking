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
import { Public } from '@app/decorator/customize';
import { CreateAuthDto } from './dto/create-auth.dto';
import { MailerService } from '@nestjs-modules/mailer';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly mailerService: MailerService,
  ) {}

  @Post('login')
  @Public()
  @UseGuards(LocalAuthGuard)
  handleLogin(@Request() req: { user: UserDocument }) {
    return this.authService.login(req.user);
  }

  @Post('register')
  @Public()
  register(@Body() registerDto: CreateAuthDto) {
    return this.authService.register(registerDto);
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
