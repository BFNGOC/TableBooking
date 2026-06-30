import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from '../types/auth-jwt-user.type';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),

      ignoreExpiration: false,

      secretOrKey: configService.get<string>('JWT_SECRET_KEY')!,
    });
  }

  validate(payload: JwtPayload) {
    return {
      _id: payload.sub,
      email: payload.email,
      role: payload.role,
    };
  }
}
