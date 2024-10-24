import {
  InfinityFindAllDto,
  InfinitySortDto,
} from '@src/utils/dto/infinity-query-all.dto';
import { IsArray, IsMongoId, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import {
  OrderFillStatusEnum,
  OrderCheckStatusEnum,
  OrderTypeEnum,
  OrderStatusEnum,
} from '@src/utils/enums/order-type.enum';
import { OrderSchemaClass } from '@src/orders/infrastructure/persistence/document/entities/order.schema';
import { Transform } from 'class-transformer';

export class FilterOrdersDto extends InfinityFindAllDto {
  @ApiProperty({
    type: String,
    description: 'Parent order id',
    required: false,
  })
  @IsMongoId({ each: true })
  @IsArray()
  @IsOptional()
  ids?: string[];

  @ApiProperty({
    type: String,
    description: '订单ID',
  })
  @IsMongoId()
  @Transform(({ value }) => (!!value ? value : undefined))
  @IsOptional()
  id?: string;
  @ApiProperty({
    type: String,
    description: 'Parent order id',
    required: false,
  })
  // @IsMongoId()
  @IsOptional()
  parentId?: string;

  @ApiProperty({
    type: String,
    description: 'User id',
    required: false,
  })
  // @IsMongoId()
  @IsOptional()
  userId?: string;

  @ApiProperty({
    type: String,
    description: 'From user id',
    required: false,
  })
  // @IsMongoId()
  @IsOptional()
  fromUserId?: string;

  @ApiProperty({
    type: String,
    description: '订单名称',
    required: false,
  })
  @IsOptional()
  orderName?: string;

  @ApiProperty({
    type: String,
    description: '订单编号',
    required: false,
  })
  @IsOptional()
  orderNo?: string;

  @ApiProperty({
    type: String,
    enum: Object.keys(OrderCheckStatusEnum),
    description: '审核状态',
    required: false,
  })
  // @IsEnum(Object.keys(OrderStatusEnum))
  @IsOptional()
  checkStatus?: string;

  @ApiProperty({
    type: String,
    enum: [...Object.keys(OrderStatusEnum), 'RUNNING', 'DELAYED'],
    description: '订单状态',
    required: false,
  })
  @IsOptional()
  status?: string;

  @ApiProperty({
    type: String,
    enum: Object.keys(OrderTypeEnum),
    description: '订单类型',
    required: false,
  })
  @IsOptional()
  orderType?: string;

  @ApiProperty({
    type: String,
    enum: Object.keys(OrderFillStatusEnum),
    description: '填写状态',
    required: false,
  })
  // @IsEnum(Object.keys(OrderFillStatusEnum))
  @IsOptional()
  fillStatus?: string;

  @ApiProperty({
    type: Boolean,
    description: '是否代理',
    required: false,
  })
  @IsOptional()
  proxySet?: boolean;
}

export class SortOrdersDto extends InfinitySortDto<OrderSchemaClass> {}
