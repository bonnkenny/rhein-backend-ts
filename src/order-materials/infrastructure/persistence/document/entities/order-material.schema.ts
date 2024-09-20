import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { now, HydratedDocument, Types } from 'mongoose';
import { EntityDocumentHelper } from '@src/utils/document-entity-helper';
import { ApiProperty } from '@nestjs/swagger';
import { LabelType } from '@src/utils/types/order-types';
import { OrderMaterialColumn } from '@src/order-material-columns/domain/order-material-column';

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
  @Prop({ required: true })
  orderId: string;

  @ApiProperty({ type: Object })
  @Prop({ required: true, type: { en: String, ch: String } })
  label: LabelType;

  @ApiProperty()
  @Prop()
  description: string;

  @ApiProperty()
  @Prop()
  subDescription: string;

  @ApiProperty()
  @Prop({ default: false, nullable: false })
  isRequired: boolean;

  @ApiProperty()
  @Prop({ type: [[{ type: OrderMaterialColumn }]] })
  columns: Array<Array<OrderMaterialColumn>>;

  @Prop({ type: Types.ObjectId })
  files: Array<Types.ObjectId>;

  @ApiProperty()
  @Prop({ default: now })
  createdAt: Date;

  @ApiProperty()
  @Prop({ default: now })
  updatedAt: Date;
}

export const OrderMaterialSchema = SchemaFactory.createForClass(
  OrderMaterialSchemaClass,
);
