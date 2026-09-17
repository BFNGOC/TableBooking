import { RequestWithUser } from '@app/auth/types/request-with-user.type';
import { ROLES_KEY } from '@app/decorator/roles.decorator';
import { UserRole } from '@app/modules/users/schemas/user.schema';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) return true;

    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const user = request.user;

    console.log('RolesGuard: requiredRoles:', requiredRoles);
    console.log('RolesGuard: user.role:', user.role);

    return requiredRoles.includes(user.role);
  }
}
