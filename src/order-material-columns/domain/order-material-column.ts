import { ApiProperty } from '@nestjs/swagger';
import { LabelType, RuleType } from '@src/utils/types/order-types';
import {
  IsArray,
  IsNotEmpty,
  IsObject,
  IsOptional,
  Validate,
} from 'class-validator';
import {
  IsLabelType,
  IsRuleType,
} from '@src/order-material-columns/validator/column-validator';

export const defaultRulesTemplate: RuleType[] = [
  {
    required: true,
    message: { en: 'This field is required', ch: '该字段必填' },
    trigger: 'blur',
  },
];

export const defaultLabelTemplate: LabelType = {
  en: 'field',
  ch: '字段',
};

// 定义 LabelType 类型
export class LabelTypeClass {
  @ApiProperty({ required: true, type: String })
  en: string;

  @ApiProperty({ required: true, type: String })
  ch: string;
}

// 定义 RuleType 类型
export class RuleTypeClass {
  @ApiProperty({ required: true, type: String })
  rule: string;

  @ApiProperty({ type: Object, required: true })
  message: Record<string, any>;

  @ApiProperty({ required: true, type: String })
  trigger: string;
}

export class OrderMaterialColumn {
  @ApiProperty({ required: true, type: String })
  @IsNotEmpty()
  prop: string;

  @ApiProperty({
    required: true,
    type: LabelTypeClass,
    default: defaultLabelTemplate,
  })
  @Validate(IsLabelType)
  @IsNotEmpty()
  @IsObject()
  label: LabelType;

  @ApiProperty({ required: true, type: String })
  @IsNotEmpty()
  valueType: string;

  @ApiProperty({ type: [String, Boolean, Number], nullable: true })
  @IsOptional()
  value: string | boolean | number | undefined;

  @ApiProperty({
    type: [RuleTypeClass],
    default: defaultRulesTemplate,
  })
  @Validate(IsRuleType)
  @IsObject({ each: true })
  @IsNotEmpty()
  @IsArray()
  rules: Array<RuleType>;
}
