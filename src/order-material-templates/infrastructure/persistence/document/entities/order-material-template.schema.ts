import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { now, HydratedDocument, Types } from 'mongoose';
import { EntityDocumentHelper } from '@src/utils/document-entity-helper';
import { ApiProperty } from '@nestjs/swagger';
import { LabelType } from '@src/utils/types/order-types';
import { OrderTypeEnum } from '@src/utils/enums/order-type.enum';
import { OrderMaterialColumn } from '@src/order-material-columns/domain/order-material-column';
import { FileSchemaClass } from '@src/files/infrastructure/persistence/document/entities/file.schema';

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
  @ApiProperty()
  @Prop({ required: true, enum: Object.values(OrderTypeEnum) })
  orderType: number;
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
  @Prop()
  columns: Array<Array<OrderMaterialColumn>>;

  @Prop({ default: null, required: true })
  filledAt: Date;

  @Prop({
    type: [{ type: Types.ObjectId, ref: FileSchemaClass.name }],
    default: [],
  })
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
