// Don't forget to use the class-validator decorators in the DTO properties.
// import { Allow } from 'class-validator';

import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateOrderMaterialColumnDto } from './create-order-material-column.dto';
import { IsArray, IsOptional, IsString, Validate } from 'class-validator';
import {
  IsLabelType,
  IsRuleType,
  IsValueType,
} from '@src/order-material-columns/validator/column-validator';
import { LabelType, RuleType } from '@src/utils/types/order-types';
import { LabelTypeClass } from '@src/order-material-columns/domain/order-material-column';

export class UpdateOrderMaterialColumnDto extends PartialType(
  CreateOrderMaterialColumnDto,
) {
  @ApiProperty()
  @IsString()
  prop: string;
  @ApiProperty()
  @Validate(IsLabelType)
  label: LabelType;
  @IsString()
  valueType: string;
  @ApiProperty()
  @IsArray()
  @Validate(IsRuleType, { each: true })
  rules: RuleType[];
  @ApiProperty({
    oneOf: [
      { type: 'string' },
      { type: 'number' },
      { type: 'boolean' },
      { type: 'null' },
    ],
    nullable: true,
  })
  @Validate(IsValueType)
  @IsOptional()
  value?: string | number | null | boolean;
  @ApiProperty({ type: LabelTypeClass })
  @Validate(IsLabelType)
  @IsOptional()
  tooltip?: LabelType;
}
