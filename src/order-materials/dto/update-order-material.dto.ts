// Don't forget to use the class-validator decorators in the DTO properties.
// import { Allow } from 'class-validator';

import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreateOrderMaterialDto } from './create-order-material.dto';
import { OrderStatusEnum } from '@src/utils/enums/order-type.enum';
import {
  IsArray,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { OrderMaterial } from '@src/order-materials/domain/order-material';

export class UpdateOrderMaterialDto extends PartialType(
  CreateOrderMaterialDto,
) {}

export class UpdateOrderMaterialStatusDto {
  @ApiProperty({ type: String, enum: OrderStatusEnum })
  @IsEnum(OrderStatusEnum)
  @IsNotEmpty({ message: 'checkStatus is required' })
  checkStatus: string;

  @ApiPropertyOptional({ type: String, description: 'Reason for rejection' })
  @MaxLength(1000)
  @IsString()
  @IsOptional()
  reason?: string;
}

export class UpdateCustomOptionalDto {
  @ApiProperty({ type: Array<string> })
  @IsMongoId({ each: true })
  @Transform(({ value }) => (!!value ? value : undefined))
  @IsArray()
  @IsNotEmpty({ message: 'ids is required' })
  ids: Array<OrderMaterial['id']>;
}
