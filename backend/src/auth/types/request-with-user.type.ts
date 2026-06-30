import { Request } from 'express';
import { AuthUser } from './auth-jwt-user.type';

export interface RequestWithUser extends Request {
  user: AuthUser;
}
