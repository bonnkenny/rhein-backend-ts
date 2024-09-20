// Don't forget to use the class-validator decorators in the DTO properties.
// import { Allow } from 'class-validator';

import { PartialType } from '@nestjs/swagger';
import { CreateOrderMaterialDto } from './create-order-material.dto';

export class UpdateOrderMaterialDto extends PartialType(
  CreateOrderMaterialDto,
) {}
