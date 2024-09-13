import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class BaseRolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const baseRoles = this.reflector.getAllAndOverride<(number | string)[]>(
      'base-roles',
      [context.getClass(), context.getHandler()],
    );
    console.log('baseRoles', baseRoles);
    if (!baseRoles.length) {
      return true;
    }
    const request = context.switchToHttp().getRequest();

    return baseRoles.map(String).includes(String(request.user?.baseRole));
  }
}
