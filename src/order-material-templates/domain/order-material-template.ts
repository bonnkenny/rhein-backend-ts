import { ApiProperty } from '@nestjs/swagger';
import { LabelType, RuleType } from '@src/utils/types/order-types';

export class OrderMaterialTemplate {
  @ApiProperty({
    type: String,
  })
  id: string;
  @ApiProperty({
    type: String,
  })
  orderType: string;
  @ApiProperty()
  prop: string;
  @ApiProperty()
  label: LabelType;
  @ApiProperty()
  rules: RuleType[];
  @ApiProperty()
  valueType: string;
  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  updatedAt: Date;
}
