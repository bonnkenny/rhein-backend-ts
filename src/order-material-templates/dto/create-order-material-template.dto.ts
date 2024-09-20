import { ApiProperty } from '@nestjs/swagger';
import { OrderMaterialColumn } from '@src/order-material-columns/domain/order-material-column';
import { IsArray, IsEnum, Validate } from 'class-validator';
import { OrderTypeEnum } from '@src/utils/enums/order-type.enum';
import { IsColumnsType } from '@src/order-material-columns/validator/column-validator';

export class CreateOrderMaterialTemplateDto {
  // Don't forget to use the class-validator decorators in the DTO properties.

  @ApiProperty({
    type: String,
    enum: Object.keys(OrderTypeEnum),
  })
  @IsEnum(Object.keys(OrderTypeEnum))
  orderType: string;

  @ApiProperty({
    type: Array,
  })
  @IsArray()
  @Validate(IsColumnsType, { each: true })
  columns: Array<Array<OrderMaterialColumn>>;

  @ApiProperty({
    type: String,
  })
  description: string;

  @ApiProperty({
    type: String,
  })
  subDescription?: string;
}
