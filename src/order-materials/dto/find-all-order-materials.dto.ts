import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { OrderTypeEnum } from '@src/utils/enums/order-type.enum';
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
}
