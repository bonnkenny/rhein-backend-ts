import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { BaseRoleEnum } from '@src/utils/enums/base-role.enum';

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
    console.log('user base role', request.user?.baseRole);

    return baseRoles
      .map(String)
      .includes(String(BaseRoleEnum[request.user?.baseRole]));
  }
}
