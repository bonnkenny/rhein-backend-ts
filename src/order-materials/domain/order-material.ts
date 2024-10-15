import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  defaultLabelTemplate,
  LabelTypeClass,
  OrderMaterialColumn,
} from '@src/order-material-columns/domain/order-material-column';
import { LabelType } from '@src/utils/types/order-types';
import { Order } from '@src/orders/domain/order';
import { OrderStatusEnum } from '@src/utils/enums/order-type.enum';

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

  @ApiPropertyOptional({
    type: String,
    enum: OrderStatusEnum,
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
