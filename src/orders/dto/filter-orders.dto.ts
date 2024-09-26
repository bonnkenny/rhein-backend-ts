import {
  InfinityFindAllDto,
  InfinitySortDto,
} from '@src/utils/dto/infinity-query-all.dto';
import { IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import {
  OrderFillStatusEnum,
  OrderStatusEnum,
  OrderTypeEnum,
} from '@src/utils/enums/order-type.enum';
import { OrderSchemaClass } from '@src/orders/infrastructure/persistence/document/entities/order.schema';

export class FilterOrdersDto extends InfinityFindAllDto {
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
    enum: Object.keys(OrderStatusEnum),
    description: '审核状态',
    required: false,
  })
  // @IsEnum(Object.keys(OrderStatusEnum))
  @IsOptional()
  checkStatus?: string;

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
}

export class SortOrdersDto extends InfinitySortDto<OrderSchemaClass> {}
