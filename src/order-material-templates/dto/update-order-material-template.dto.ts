// Don't forget to use the class-validator decorators in the DTO properties.
// import { Allow } from 'class-validator';

import { PartialType } from '@nestjs/swagger';
import { CreateOrderMaterialTemplateDto } from './create-order-material-template.dto';

export class UpdateOrderMaterialTemplateDto extends PartialType(
  CreateOrderMaterialTemplateDto,
) {}
