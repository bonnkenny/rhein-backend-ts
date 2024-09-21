import { ApiProperty } from '@nestjs/swagger';
import {
  defaultLabelTemplate,
  LabelTypeClass,
  OrderMaterialColumn,
} from '@src/order-material-columns/domain/order-material-column';
import {
  IsArray,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  Validate,
} from 'class-validator';
import {
  IsColumnsType,
  IsLabelType,
} from '@src/order-material-columns/validator/column-validator';
import { LabelType } from '@src/utils/types/order-types';
import { OrderTypeEnum } from '@src/utils/enums/order-type.enum';
import { Transform } from 'class-transformer';

export class CreateOrderMaterialDto {
  // Don't forget to use the class-validator decorators in the DTO properties.

  @ApiProperty({
    type: String,
  })
  @IsMongoId()
  @IsNotEmpty()
  orderId: string;

  @ApiProperty({
    type: LabelTypeClass,
    default: defaultLabelTemplate,
  })
  @Validate(IsLabelType)
  @IsNotEmpty()
  @IsOptional()
  label: LabelType;

  @ApiProperty({
    type: String,
    enum: Object.keys(OrderTypeEnum),
  })
  @IsEnum(Object.keys(OrderTypeEnum))
  @IsNotEmpty()
  orderType: string;

  @ApiProperty({
    type: () => [[OrderMaterialColumn]],
  })
  @IsArray()
  @Validate(IsColumnsType, { each: true })
  @IsNotEmpty()
  columns: Array<Array<OrderMaterialColumn>>;

  @ApiProperty({
    type: LabelTypeClass,
    default: defaultLabelTemplate,
  })
  @Validate(IsLabelType)
  @IsNotEmpty()
  @IsOptional()
  description: LabelType;

  @ApiProperty({
    type: LabelTypeClass,
    default: defaultLabelTemplate,
  })
  @Validate(IsLabelType)
  @IsNotEmpty()
  @IsOptional()
  subDescription?: LabelType;

  @Transform(() => {
    return null;
  })
  filledAt: Date | null;
}
