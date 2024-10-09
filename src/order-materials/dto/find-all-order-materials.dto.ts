import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import {
  OrderStatusEnum,
  OrderTypeEnum,
} from '@src/utils/enums/order-type.enum';
import { InfinityFindAllDto } from '@src/utils/dto/infinity-query-all.dto';
import { Transform } from 'class-transformer';

export class FindAllOrderMaterialsDto extends InfinityFindAllDto {
  @ApiPropertyOptional({
    type: String,
    description: '订单ID',
  })
  // @IsMongoId()
  @IsOptional()
  orderId: string;
  @ApiProperty({
    type: String,
    enum: Object.keys(OrderTypeEnum),
  })
  @IsEnum(OrderStatusEnum)
  @Transform(({ value }) => (!!value ? value : undefined))
  @IsOptional()
  orderType: string;

  @ApiPropertyOptional({
    type: String,
    enum: OrderStatusEnum,
    description: '审核状态',
  })
  @IsEnum(OrderStatusEnum)
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
