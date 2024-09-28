// Don't forget to use the class-validator decorators in the DTO properties.
// import { Allow } from 'class-validator';

import { PartialType } from '@nestjs/swagger';
import { CreateOrderUserDto } from './create-order-user.dto';

export class UpdateorderUserDto extends PartialType(CreateOrderUserDto) {}
