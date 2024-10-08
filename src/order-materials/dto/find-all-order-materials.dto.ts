import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsOptional } from 'class-validator';
import {
  OrderStatusEnum,
  OrderTypeEnum,
} from '@src/utils/enums/order-type.enum';
import { InfinityFindAllDto } from '@src/utils/dto/infinity-query-all.dto';

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
  @IsOptional()
  orderType: string;

  @ApiPropertyOptional({
    type: String,
    enum: OrderStatusEnum,
    description: '审核状态',
  })
  @IsEnum(OrderStatusEnum)
  @IsOptional()
  checkStatus: string;

  @ApiPropertyOptional({
    type: Boolean,
    description: '是否可选',
  })
  @IsBoolean()
  @IsOptional()
  isOptional: boolean;
}
