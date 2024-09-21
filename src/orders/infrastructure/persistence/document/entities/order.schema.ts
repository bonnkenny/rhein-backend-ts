import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { now, HydratedDocument, Types } from 'mongoose';
import { EntityDocumentHelper } from '@src/utils/document-entity-helper';
import { ApiProperty } from '@nestjs/swagger';
import { OrderTypeEnum } from '@src/utils/enums/order-type.enum';

export type OrderSchemaDocument = HydratedDocument<OrderSchemaClass>;

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    getters: true,
  },
})
export class OrderSchemaClass extends EntityDocumentHelper {
  @ApiProperty()
  @Prop()
  orderNo: string;

  @ApiProperty()
  @Prop()
  orderName: string;

  @ApiProperty({ type: Types.ObjectId })
  @Prop({ default: null })
  parentId: Types.ObjectId;

  @ApiProperty({ type: String })
  @Prop({ required: true, enum: Object.values(OrderTypeEnum) })
  orderType: string;

  @ApiProperty({ type: String })
  @Prop({ required: true, default: null })
  email: string;

  @ApiProperty({ type: Types.ObjectId })
  @Prop({ required: true })
  userId: Types.ObjectId;

  @ApiProperty()
  @Prop({ maxlength: 1000 })
  remark: string;

  @ApiProperty({ type: Number })
  @Prop({ default: 0, nullable: false })
  fillStatus: number;

  @ApiProperty({ type: Number })
  @Prop({ default: 0, nullable: false })
  checkStatus: number;

  @ApiProperty()
  @Prop()
  deletedAt: Date;

  @ApiProperty()
  @Prop({ default: now })
  createdAt: Date;

  @ApiProperty()
  @Prop({ default: now })
  updatedAt: Date;
}

export const OrderSchema = SchemaFactory.createForClass(OrderSchemaClass);

OrderSchema.index({ orderType: 1 });
OrderSchema.index({ orderNo: 1 });
OrderSchema.index({ email: 1 });
OrderSchema.index({ checkStatus: 1 });
OrderSchema.index({ fillStatus: 1 });
