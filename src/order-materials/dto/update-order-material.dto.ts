// Don't forget to use the class-validator decorators in the DTO properties.
// import { Allow } from 'class-validator';

import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreateOrderMaterialDto } from './create-order-material.dto';
import { OrderCheckStatusEnum } from '@src/utils/enums/order-type.enum';
import {
  IsArray,
  IsBoolean,
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
) {
  @ApiProperty({
    type: Boolean,
    default: false,
    description: '是否同意资料真实性责任认定书',
  })
  @IsBoolean()
  @Transform(({ value }) => {
    if (value === 'true') {
      return true;
    }
    if (value === 'false') {
      return false;
    }
    return value;
  })
  @IsNotEmpty()
  agreement: boolean;
}

export class UpdateOrderMaterialStatusDto {
  @ApiProperty({ type: String, enum: OrderCheckStatusEnum })
  @IsEnum(OrderCheckStatusEnum)
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
