import { InfinityFindAllDto } from '@src/utils/dto/infinity-query-all.dto';
import { IsEnum, IsMongoId, IsOptional } from 'class-validator';
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
  @IsMongoId()
  @IsOptional()
  parentId?: string;

  @ApiProperty({
    type: String,
    description: 'User id',
  })
  @IsMongoId()
  @IsOptional()
  userId?: string;

  @ApiProperty({
    type: String,
    description: 'From user id',
  })
  @IsMongoId()
  @IsOptional()
  fromUserId?: string;

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
}
