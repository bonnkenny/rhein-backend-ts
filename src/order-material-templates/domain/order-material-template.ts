import { ApiProperty } from '@nestjs/swagger';
import {
  defaultLabelTemplate,
  LabelTypeClass,
  OrderMaterialColumn,
} from '@src/order-material-columns/domain/order-material-column';
import { LabelType } from '@src/utils/types/order-types';

export class OrderMaterialTemplate {
  @ApiProperty({
    type: String,
  })
  id: string;
  @ApiProperty({
    type: String,
  })
  orderType: string;
  @ApiProperty({
    type: LabelTypeClass,
    default: defaultLabelTemplate,
  })
  label: LabelType;

  @ApiProperty({
    type: LabelTypeClass,
    default: defaultLabelTemplate,
  })
  description: LabelType | null;

  @ApiProperty({
    type: LabelTypeClass,
    default: defaultLabelTemplate,
  })
  subDescription?: LabelType | null;

  @ApiProperty({
    type: [[OrderMaterialColumn]],
  })
  columns: Array<Array<OrderMaterialColumn>>;

  @ApiProperty()
  filledAt: Date | null;

  @ApiProperty({
    type: Boolean,
  })
  isOptional: boolean;

  @ApiProperty({
    type: Boolean,
    description: '是否为多行，默认为false',
  })
  isMultiple: boolean;

  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  updatedAt: Date;
}
