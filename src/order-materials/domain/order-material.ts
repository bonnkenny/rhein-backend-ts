import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  defaultLabelTemplate,
  LabelTypeClass,
  OrderMaterialColumn,
} from '@src/order-material-columns/domain/order-material-column';
import { LabelType } from '@src/utils/types/order-types';
import { Order } from '@src/orders/domain/order';
import { OrderCheckStatusEnum } from '@src/utils/enums/order-type.enum';
import { Transform } from 'class-transformer';

export class OrderMaterial {
  @ApiProperty({
    type: String,
  })
  id: string;
  @ApiProperty({
    type: String,
  })
  orderId: string;
  @ApiProperty({
    type: String,
  })
  orderType: string;
  @ApiProperty({
    type: String,
  })
  templateType: string;

  @ApiProperty({
    type: String,
    description: '特殊类型,比如声明',
    default: null,
  })
  @Transform(({ value }) => {
    return value ?? null;
  })
  specialType?: string | null;

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
    type: Boolean,
  })
  isOptional: boolean;

  @ApiProperty({
    type: Boolean,
    default: '自定义是否必填',
  })
  isOptionalCustom: boolean;

  @ApiProperty({
    type: Boolean,
    default: '是否为多行',
  })
  isMultiple: boolean;

  @ApiProperty({
    type: [[OrderMaterialColumn]],
  })
  columns: Array<Array<OrderMaterialColumn>>;

  @ApiProperty()
  filledAt: Date | null;

  @ApiProperty({
    type: Boolean,
  })
  agreement: boolean;

  @ApiPropertyOptional({
    type: String,
    enum: OrderCheckStatusEnum,
  })
  checkStatus?: string;

  @ApiPropertyOptional({
    type: String,
  })
  reason?: string;

  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  updatedAt: Date;

  @ApiPropertyOptional({
    type: () => Order,
  })
  order?: Order;
}
