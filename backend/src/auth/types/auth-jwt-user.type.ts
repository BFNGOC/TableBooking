import { UserRole } from '@app/modules/users/schemas/user.schema';

export type JwtPayload = {
  sub: string;
  email: string;
  role: UserRole;
};

export type AuthUser = {
  _id: string;
  email: string;
  role: UserRole;
};
