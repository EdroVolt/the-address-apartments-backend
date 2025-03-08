import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../../users/entities/user.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<UserRole[]>(
      'roles',
      context.getHandler(),
    );

    if (!requiredRoles) {
      return true; // No roles required, allow access
    }

    const request = context.switchToHttp().getRequest<Request>();
    const user =
      request && typeof request === 'object' && 'user' in request
        ? (request.user as { role: UserRole })
        : null;

    if (!user) {
      return false; // No user found, deny access
    }

    return requiredRoles.includes(user.role);
  }
}
