import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { now, HydratedDocument, Types } from 'mongoose';
import { EntityDocumentHelper } from '@src/utils/document-entity-helper';
import { ApiProperty } from '@nestjs/swagger';
import { LabelType } from '@src/utils/types/order-types';
import { OrderMaterialColumn } from '@src/order-material-columns/domain/order-material-column';
import {
  MaterialTemplateTypeEnum,
  OrderStatusEnum,
  OrderTypeEnum,
} from '@src/utils/enums/order-type.enum';
import { OrderSchemaClass } from '@src/orders/infrastructure/persistence/document/entities/order.schema';

export type OrderMaterialSchemaDocument =
  HydratedDocument<OrderMaterialSchemaClass>;

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    getters: true,
  },
})
export class OrderMaterialSchemaClass extends EntityDocumentHelper {
  @ApiProperty()
  @Prop({ required: true, type: Types.ObjectId })
  orderId: Types.ObjectId;

  @ApiProperty({ type: String })
  @Prop({ required: true, enum: OrderTypeEnum })
  orderType: string;

  @Prop({ required: true, enum: MaterialTemplateTypeEnum })
  templateType: string;

  @ApiProperty({ type: Object })
  @Prop({ required: true, type: { en: String, ch: String } })
  label: LabelType;

  @ApiProperty()
  @Prop({ default: null, type: { en: String, ch: String } })
  description: LabelType | null;

  @ApiProperty()
  @Prop({ default: null, type: { en: String, ch: String } })
  subDescription: LabelType | null;

  @ApiProperty()
  @Prop({ default: false, type: Boolean, nullable: false })
  isOptional: boolean;

  @ApiProperty()
  @Prop({ default: false, type: Boolean, nullable: false })
  isMultiple: boolean;

  @ApiProperty()
  @Prop({ type: [[{ type: OrderMaterialColumn }]] })
  columns: Array<Array<OrderMaterialColumn>>;

  @ApiProperty()
  @Prop({ default: null, type: Date })
  filledAt: Date | null;

  @Prop({ type: Types.ObjectId })
  files: Array<Types.ObjectId>;

  @ApiProperty({
    enum: OrderStatusEnum,
  })
  @Prop({ default: OrderStatusEnum.PENDING, enum: OrderStatusEnum })
  checkStatus: string;

  @ApiProperty({ type: String, nullable: true })
  @Prop({ default: null, nullable: true })
  reason: string;

  @ApiProperty()
  @Prop({ default: now })
  createdAt: Date;

  @ApiProperty()
  @Prop({ default: now })
  updatedAt: Date;

  @ApiProperty({
    type: OrderSchemaClass,
  })
  order?: OrderSchemaClass;
}

export const OrderMaterialSchema = SchemaFactory.createForClass(
  OrderMaterialSchemaClass,
);

OrderMaterialSchema.virtual('order', {
  ref: OrderSchemaClass.name,
  localField: 'orderId',
  foreignField: '_id',
  justOne: true,
});
