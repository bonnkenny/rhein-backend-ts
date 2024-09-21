import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { CreateOrderMaterialTemplateDto } from '@src/order-material-templates/dto/create-order-material-template.dto';
import { OrderTypeEnum } from '@src/utils/enums/order-type.enum';

export class FindAllOrderMaterialsDto {
  @ApiPropertyOptional()
  @Transform(({ value }) => (value ? Number(value) : 1))
  @IsNumber()
  @IsOptional()
  page?: number;

  @ApiPropertyOptional()
  @Transform(({ value }) => (value ? Number(value) : 10))
  @IsNumber()
  @IsOptional()
  limit?: number;
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
