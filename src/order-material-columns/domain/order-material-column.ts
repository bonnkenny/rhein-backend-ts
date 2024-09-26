import { ApiProperty } from '@nestjs/swagger';
import { LabelType, OptionsType, RuleType } from '@src/utils/types/order-types';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Validate,
} from 'class-validator';
import {
  IsAutoSizeType,
  IsFieldPropsType,
  IsLabelType,
  IsOptionsType,
  IsRuleType,
  IsValueType,
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

export const defaultTooltipTemplate: LabelType = {
  en: '',
  ch: '',
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
  @ApiProperty({ required: true, type: Boolean })
  required: boolean;

  @ApiProperty({ type: Object, required: true })
  message: Record<string, any>;

  @ApiProperty({ required: true, type: String })
  trigger?: string;
}

export class OptionTypeClass {
  @ApiProperty({ required: true, type: LabelTypeClass })
  @Validate(IsLabelType)
  @IsNotEmpty()
  label: LabelTypeClass;

  @ApiProperty({
    oneOf: [{ type: 'string' }, { type: 'number' }, { type: 'boolean' }],
    nullable: true,
    required: false,
  })
  @Validate(IsValueType)
  @IsNotEmpty()
  value: string;

  @ApiProperty({ required: false, type: String })
  @IsString()
  @IsOptional()
  color: string;
}

export class AutoSizeTypeClass {
  @ApiProperty({ required: true, type: Number })
  @IsNumber()
  @IsOptional()
  minRows?: number;

  @ApiProperty({ required: true, type: Number })
  @IsNumber()
  @IsOptional()
  maxRows?: number;
}

export class FieldPropsTypeClass {
  @ApiProperty({ required: false, type: String })
  @IsString()
  @IsOptional()
  type?: string;

  @ApiProperty({ required: false, type: LabelTypeClass })
  @Validate(IsLabelType)
  @IsObject()
  @IsOptional()
  placeholder?: LabelTypeClass;

  @ApiProperty({ required: false, type: LabelTypeClass })
  @Validate(IsLabelType)
  @IsObject()
  @IsOptional()
  startPlaceholder?: LabelTypeClass;

  @ApiProperty({ required: false, type: LabelTypeClass })
  @Validate(IsLabelType)
  @IsObject()
  @IsOptional()
  endPlaceholder?: LabelTypeClass;

  @ApiProperty({ required: false, type: Number })
  @IsNumber()
  @IsOptional()
  maxlength?: number;

  @ApiProperty({ required: false, type: Boolean })
  @IsBoolean()
  @IsOptional()
  showWordLimit?: boolean;

  @ApiProperty({ required: false, type: AutoSizeTypeClass })
  @Validate(IsAutoSizeType)
  @IsObject()
  @IsOptional()
  autoSize?: AutoSizeTypeClass;
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

  @ApiProperty({
    oneOf: [
      { type: 'string' },
      { type: 'number' },
      { type: 'boolean' },
      { type: 'null' },
    ],
    nullable: true,
    required: false,
  })
  @Validate(IsValueType)
  @IsOptional()
  value?: string | number | boolean | null;

  @ApiProperty({
    type: [RuleTypeClass],
    default: defaultRulesTemplate,
  })
  @Validate(IsRuleType, { each: true })
  @IsObject({ each: true })
  @IsArray()
  @IsNotEmpty()
  rules?: Array<RuleTypeClass>;

  @ApiProperty({
    type: LabelTypeClass,
    required: false,
  })
  @IsNotEmpty()
  @IsOptional()
  tooltip?: LabelType;

  @ApiProperty({
    type: [OptionTypeClass],
    required: false,
  })
  @IsObject({ each: true })
  @Validate(IsOptionsType, { each: true })
  @IsObject({ each: true })
  @IsArray()
  @IsOptional()
  options?: OptionsType[];

  @ApiProperty({
    type: FieldPropsTypeClass,
    required: false,
  })
  @Validate(IsFieldPropsType)
  @IsObject()
  @IsOptional()
  fieldProps?: FieldPropsTypeClass;
}
