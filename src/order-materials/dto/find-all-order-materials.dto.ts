import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsMongoId, IsOptional } from 'class-validator';
import { CreateOrderMaterialTemplateDto } from '@src/order-material-templates/dto/create-order-material-template.dto';
import { OrderTypeEnum } from '@src/utils/enums/order-type.enum';
import { InfinityFindAllDto } from '@src/utils/dto/infinity-query-all.dto';
import { Transform } from 'class-transformer';
import { Types } from 'mongoose';

export class FindAllOrderMaterialsDto extends InfinityFindAllDto {
  @ApiPropertyOptional({
    type: String,
    description: '订单ID',
  })
  @Transform(({ value }) => {
    if (!!value) {
      return new Types.ObjectId(value);
    }
  })
  @IsMongoId()
  @IsOptional()
  orderId: string;
}

export class defaultQueryOptionsDto extends PartialType(
  CreateOrderMaterialTemplateDto,
) {
  @ApiProperty({
    type: String,
    enum: Object.keys(OrderTypeEnum),
  })
  @IsOptional()
  orderType: string;

  @ApiProperty({
    type: String,
  })
  @IsOptional()
  OrderId: string;
}
