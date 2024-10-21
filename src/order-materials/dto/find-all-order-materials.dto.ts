import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsMongoId, IsOptional } from 'class-validator';
import {
  OrderCheckStatusEnum,
  OrderTypeEnum,
} from '@src/utils/enums/order-type.enum';
import { InfinityFindAllDto } from '@src/utils/dto/infinity-query-all.dto';
import { Transform } from 'class-transformer';

export class FindAllOrderMaterialsDto extends InfinityFindAllDto {
  @ApiPropertyOptional({
    type: String,
    description: '订单ID',
  })
  @IsMongoId()
  @Transform(({ value }) => (!!value ? value : undefined))
  @IsOptional()
  orderId: string;
  @ApiProperty({
    type: String,
    enum: Object.keys(OrderTypeEnum),
  })
  @IsEnum(OrderCheckStatusEnum)
  @Transform(({ value }) => (!!value ? value : undefined))
  @IsOptional()
  orderType: string;

  @ApiPropertyOptional({
    type: String,
    enum: OrderCheckStatusEnum,
    description: '审核状态',
  })
  @IsEnum(OrderCheckStatusEnum)
  @Transform(({ value }) => (!!value ? value : undefined))
  @IsOptional()
  checkStatus: string;

  @ApiPropertyOptional({
    type: Boolean,
    description: '是否可选',
  })
  @Transform(({ value }): boolean | undefined => {
    if (value.toLowerCase() === 'true') {
      return true;
    }
    if (value.toLowerCase() === 'false') {
      return false;
    }
    return undefined;
  })
  @IsOptional()
  isOptional: boolean;
}
