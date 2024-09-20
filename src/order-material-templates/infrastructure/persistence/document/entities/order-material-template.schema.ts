import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { now, HydratedDocument, Types } from 'mongoose';
import { EntityDocumentHelper } from '@src/utils/document-entity-helper';
import { ApiProperty } from '@nestjs/swagger';
import { LabelType } from '@src/utils/types/order-types';

export type OrderMaterialTemplateSchemaDocument =
  HydratedDocument<OrderMaterialTemplateSchemaClass>;

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    getters: true,
  },
})
export class OrderMaterialTemplateSchemaClass extends EntityDocumentHelper {
  @ApiProperty({ type: Object })
  @Prop({ required: true })
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
  @Prop()
  columns: Array<any>;

  @Prop({ default: null, required: true })
  filledAt: Date;

  @Prop({ type: Types.ObjectId, default: [] })
  files: Array<Types.ObjectId>;

  @ApiProperty()
  @Prop({ default: now })
  createdAt: Date;

  @ApiProperty()
  @Prop({ default: now })
  updatedAt: Date;
}

export const OrderMaterialTemplateSchema = SchemaFactory.createForClass(
  OrderMaterialTemplateSchemaClass,
);
