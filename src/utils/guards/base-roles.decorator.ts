import { SetMetadata } from '@nestjs/common';

export const BaseRoles = (...baseRoles: string[]) =>
  SetMetadata('base-roles', baseRoles);
