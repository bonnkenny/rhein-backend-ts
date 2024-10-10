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
import {
  MaterialTemplateTypeEnum,
  OrderTypeEnum,
} from '@src/utils/enums/order-type.enum';
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
    enum: OrderTypeEnum,
  })
  @IsEnum(OrderTypeEnum)
  @IsNotEmpty()
  orderType: string;

  @ApiProperty({
    type: String,
    enum: MaterialTemplateTypeEnum,
  })
  @IsEnum(OrderTypeEnum)
  @IsNotEmpty()
  templateType: string;

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
  description: LabelType | null;

  @ApiProperty({
    type: LabelTypeClass,
    default: defaultLabelTemplate,
  })
  @Validate(IsLabelType)
  @IsNotEmpty()
  @IsOptional()
  subDescription: LabelType | null;

  @ApiProperty({
    type: Boolean,
    default: false,
  })
  @IsOptional()
  isOptional: boolean;

  @ApiProperty({
    type: Boolean,
    default: false,
  })
  @IsOptional()
  isMultiple: boolean;

  @Transform(() => {
    return null;
  })
  filledAt: Date | null;
}
