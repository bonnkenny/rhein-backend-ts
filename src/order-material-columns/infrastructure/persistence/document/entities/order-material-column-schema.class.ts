import { ApiProperty } from '@nestjs/swagger';
import { LabelType, RuleType } from '@src/utils/types/order-types';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { EntityDocumentHelper } from '@src/utils/document-entity-helper';
import { HydratedDocument } from 'mongoose';
import {
  LabelTypeClass,
  RuleTypeClass,
} from '@src/order-material-columns/domain/order-material-column';

export type OrderMaterialColumnSchemaDocument =
  HydratedDocument<OrderMaterialColumnSchemaClass>;

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    getters: true,
  },
})
export class OrderMaterialColumnSchemaClass extends EntityDocumentHelper {
  @ApiProperty({ required: true })
  @Prop({ required: true })
  prop: string;

  @ApiProperty({ required: true })
  @Prop({ required: true, type: LabelTypeClass })
  label: LabelType;

  @ApiProperty({ required: true, default: 'copy', type: String })
  valueType: string;

  @ApiProperty({ required: false, type: String })
  value: string;

  @ApiProperty({ required: false, type: Array<RuleTypeClass> })
  @Prop({
    type: [{ type: RuleTypeClass }],
    default: [
      {
        rule: 'required',
        message: { en: 'This field is required', ch: '该字段必填' },
        trigger: 'blur',
      },
    ],
  })
  rules: Array<RuleType>;

  @ApiProperty({ required: false, type: LabelTypeClass })
  @Prop({ type: LabelTypeClass, required: false })
  tooltip: LabelType;
}

export const OrderMaterialColumnSchema = SchemaFactory.createForClass(
  OrderMaterialColumnSchemaClass,
);
