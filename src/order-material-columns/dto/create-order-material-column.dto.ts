import { LabelType, RuleType } from '@src/utils/types/order-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString, Validate } from 'class-validator';
import {
  IsLabelType,
  IsRuleType,
} from '@src/order-material-columns/validator/column-validator';

export class CreateOrderMaterialColumnDto {
  // Don't forget to use the class-validator decorators in the DTO properties.
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
  value?: any;
}
