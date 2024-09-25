import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { OrderTypeEnum } from '@src/utils/enums/order-type.enum';
import { InfinityFindAllDto } from '@src/utils/dto/infinity-query-all.dto';

export class FindAllOrderMaterialTemplatesDto {
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

export class FilterOrderMaterialTemplatesDto extends InfinityFindAllDto {
  @ApiProperty({
    type: String,
    enum: Object.keys(OrderTypeEnum),
  })
  @IsOptional()
  orderType: string;
}
