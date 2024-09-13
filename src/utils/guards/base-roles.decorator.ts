import { SetMetadata } from '@nestjs/common';

export const BaseRoles = (...baseRoles: number[]) =>
  SetMetadata('base-roles', baseRoles);
