// Don't forget to use the class-validator decorators in the DTO properties.
// import { Allow } from 'class-validator';

import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreateOrderMaterialDto } from './create-order-material.dto';
import { OrderStatusEnum } from '@src/utils/enums/order-type.enum';
import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateOrderMaterialDto extends PartialType(
  CreateOrderMaterialDto,
) {
  @ApiPropertyOptional({ type: String, enum: OrderStatusEnum })
  @IsEnum(OrderStatusEnum)
  checkStatus?: string;

  @ApiPropertyOptional({ type: String, description: 'Reason for rejection' })
  @MaxLength(1000)
  @IsString()
  @IsOptional()
  reason?: string;
}
