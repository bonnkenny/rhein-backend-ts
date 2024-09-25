import { InfinityFindAllDto } from '@src/utils/dto/infinity-query-all.dto';
import { IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import {
  OrderFillStatusEnum,
  OrderStatusEnum,
} from '@src/utils/enums/order-type.enum';

export class FilterOrdersDto extends InfinityFindAllDto {
  @ApiProperty({
    type: String,
    description: 'Parent order id',
  })
  // @IsMongoId()
  @IsOptional()
  parentId?: string;

  @ApiProperty({
    type: String,
    description: 'User id',
  })
  // @IsMongoId()
  @IsOptional()
  userId?: string;

  @ApiProperty({
    type: String,
    description: 'From user id',
  })
  // @IsMongoId()
  @IsOptional()
  fromUserId?: string;

  @ApiProperty({
    type: String,
    description: '订单名称',
  })
  orderName?: string;

  @ApiProperty({
    type: String,
    description: '订单编号',
  })
  orderNo?: string;

  @ApiProperty({
    type: String,
    enum: Object.keys(OrderStatusEnum),
    description: '审核状态',
  })
  // @IsEnum(Object.keys(OrderStatusEnum))
  @IsOptional()
  checkStatus?: string;

  @ApiProperty({
    type: String,
    enum: Object.keys(OrderFillStatusEnum),
    description: '填写状态',
  })
  // @IsEnum(Object.keys(OrderFillStatusEnum))
  @IsOptional()
  fillStatus?: string;
}
