import { ApiProperty } from '@nestjs/swagger';
import { LabelType, RuleType } from '@src/utils/types/order-types';

export class OrderMaterialColumnSchema {
  @ApiProperty({ required: true })
  prop: string;

  @ApiProperty({ required: true })
  label: LabelType;

  @ApiProperty({ required: true })
  valueType: string;

  @ApiProperty()
  value: any;

  @ApiProperty()
  // @Prop({
  //   default: [
  //     {
  //       rule: 'required',
  //       message: { en: 'This field is required', ch: '该字段必填' },
  //       trigger: 'blur',
  //     },
  //   ],
  // })
  rules: Array<RuleType>;
}
