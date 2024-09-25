import { LabelType, RuleType } from '@src/utils/types/order-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString, Validate } from 'class-validator';
import {
  IsLabelType,
  IsRuleType,
  IsValueType,
} from '@src/order-material-columns/validator/column-validator';
import { LabelTypeClass } from '@src/order-material-columns/domain/order-material-column';

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
  @ApiProperty({ type: [String, Number, Boolean], nullable: true })
  @Validate(IsValueType)
  @IsOptional()
  value?: string | number | boolean | null;

  @ApiProperty({ type: LabelTypeClass })
  @Validate(IsLabelType)
  @IsOptional()
  tooltip?: LabelType;
}
