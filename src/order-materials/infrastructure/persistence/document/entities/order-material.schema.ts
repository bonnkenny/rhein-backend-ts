import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { now, HydratedDocument, Types } from 'mongoose';
import { EntityDocumentHelper } from '@src/utils/document-entity-helper';
import { ApiProperty } from '@nestjs/swagger';
import { LabelType } from '@src/utils/types/order-types';
import { OrderMaterialColumn } from '@src/order-material-columns/domain/order-material-column';
import { OrderTypeEnum } from '@src/utils/enums/order-type.enum';

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
  @Prop({ required: true, enum: Object.values(OrderTypeEnum) })
  orderType: string;

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
  @Prop({
    type: [
      {
        type: [
          {
            type: {
              label: { en: String, ch: String },
              prop: String,
              rules: [
                {
                  rule: String,
                  message: { en: String, ch: String },
                  trigger: String,
                },
              ],
              value: String,
              valueType: String,
            },
          },
        ],
      },
    ],
  })
  columns: Array<Array<OrderMaterialColumn>>;

  @ApiProperty()
  @Prop({ default: null, type: Date })
  filledAt: Date | null;

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
