// Don't forget to use the class-validator decorators in the DTO properties.
// import { Allow } from 'class-validator';

import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateOrderDto } from './create-order.dto';
import {
  IsEmail,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import {
  OrderFillStatusEnum,
  OrderStatusEnum,
} from '@src/utils/enums/order-type.enum';
import { Transform } from 'class-transformer';

export class UpdateOrderDto extends PartialType(CreateOrderDto) {
  // Don't forget to use the class-validator decorators in the DTO properties.
  @ApiProperty({
    type: String,
  })
  @MaxLength(100, { message: 'OrderNo is too long' })
  @IsNotEmpty()
  @IsOptional()
  orderNo?: string;

  @ApiProperty({
    type: String,
  })
  @MaxLength(100, { message: 'Order name is too long' })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  orderName?: string;

  // @ApiProperty({
  //   type: String,
  //   enum: Object.keys(OrderTypeEnum),
  // })
  // @IsEnum(Object.keys(OrderTypeEnum), {
  //   message:
  //     'Invalid order type,order type must be one of the following values:' +
  //     Object.keys(OrderTypeEnum).join(' '),
  // })
  // @IsNotEmpty()
  // @IsOptional()
  // orderType?: string;

  @ApiProperty({
    type: String,
  })
  @IsMongoId()
  @IsString()
  @IsOptional()
  // @Transform(({ value }) => {
  //   return !!value ? new Types.ObjectId(value) : value;
  // })
  parentId?: string;

  @ApiProperty({
    type: String,
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({
    type: String,
    enum: Object.keys(OrderStatusEnum),
  })
  @IsEnum(Object.keys(OrderStatusEnum))
  @IsOptional()
  checkStatus?: string;

  @ApiProperty({
    type: String,
    enum: Object.keys(OrderFillStatusEnum),
  })
  @IsEnum(Object.keys(OrderFillStatusEnum))
  @IsOptional()
  fillStatus?: string;

  @ApiProperty({
    type: Boolean,
  })
  @Transform(({ value }) => {
    if (value === 'false') {
      return false;
    }
    if (value === 'true') {
      return true;
    }
    return undefined;
  })
  @IsOptional()
  proxySet?: boolean;
}
