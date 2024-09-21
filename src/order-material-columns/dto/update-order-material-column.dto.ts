// Don't forget to use the class-validator decorators in the DTO properties.
// import { Allow } from 'class-validator';

import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateOrderMaterialColumnDto } from './create-order-material-column.dto';
import { IsArray, IsString, Validate } from 'class-validator';
import {
  IsLabelType,
  IsRuleType,
} from '@src/order-material-columns/validator/column-validator';
import { LabelType, RuleType } from '@src/utils/types/order-types';

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
  @ApiProperty({ type: [String, Boolean, Number], nullable: true })
  value?: string | number | null | boolean;
}
