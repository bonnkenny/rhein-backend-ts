import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { now, HydratedDocument, Types } from 'mongoose';
import { EntityDocumentHelper } from '@src/utils/document-entity-helper';
import { ApiProperty } from '@nestjs/swagger';
import { LabelType } from '@src/utils/types/order-types';
import { MaterialTemplateTypeEnum } from '@src/utils/enums/order-type.enum';
import {
  LabelTypeClass,
  OrderMaterialColumn,
} from '@src/order-material-columns/domain/order-material-column';
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
  @ApiProperty({ type: String, enum: MaterialTemplateTypeEnum })
  @Prop({ required: true, enum: MaterialTemplateTypeEnum })
  templateType: string;

  @ApiProperty({ type: LabelTypeClass })
  @Prop({ required: true, type: { en: String, ch: String } })
  label: LabelType;

  @ApiProperty()
  @Prop({ default: null, type: { en: String, ch: String } })
  description: LabelType | null;

  @ApiProperty({
    type: LabelTypeClass,
    default: null,
    nullable: true,
  })
  @Prop({ default: null, type: { en: String, ch: String } })
  subDescription: LabelType | null;

  @ApiProperty({
    type: Boolean,
    default: false,
    nullable: false,
  })
  @Prop({ default: false, type: Boolean, nullable: false })
  isOptional: boolean;

  @ApiProperty({
    type: Boolean,
    default: false,
    nullable: false,
  })
  @Prop({ default: false, type: Boolean, nullable: false })
  isMultiple: boolean;

  @ApiProperty()
  // @Prop({
  //   type: [
  //     {
  //       type: [
  //         {
  //           type: OrderMaterialColumn,
  //         },
  //       ],
  //     },
  //   ],
  // })
  @Prop({ type: [[{ type: OrderMaterialColumn }]] })
  columns: Array<Array<OrderMaterialColumn>>;

  @ApiProperty()
  @Prop({ default: null, type: Date })
  filledAt: Date | null;

  @ApiProperty()
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
