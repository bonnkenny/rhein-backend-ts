import { LabelType } from '@src/utils/types/order-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString, Validate } from 'class-validator';
import {
  IsFieldPropsType,
  IsLabelType,
  IsRuleType,
  IsValueType,
} from '@src/order-material-columns/validator/column-validator';
import {
  FieldPropsTypeClass,
  LabelTypeClass,
  RuleTypeClass,
} from '@src/order-material-columns/domain/order-material-column';

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
  rules?: RuleTypeClass[];

  @ApiProperty({
    oneOf: [
      { type: 'string' },
      { type: 'number' },
      { type: 'boolean' },
      { type: 'null' },
    ],
    required: false,
    nullable: true,
  })
  @Validate(IsValueType)
  @IsOptional()
  value?: string | number | boolean | null;

  @ApiProperty({
    type: LabelTypeClass,
    required: false,
  })
  @Validate(IsLabelType)
  @IsOptional()
  tooltip?: LabelTypeClass;

  @ApiProperty({
    type: FieldPropsTypeClass,
    required: false,
  })
  @Validate(IsFieldPropsType)
  @IsOptional()
  fieldProps?: FieldPropsTypeClass;
}
