import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { now, HydratedDocument, Types } from 'mongoose';
import { EntityDocumentHelper } from '@src/utils/document-entity-helper';
import { ApiProperty } from '@nestjs/swagger';
import { NewsActionEnum } from '@src/utils/enums/news-action.enum';
import { LabelType } from '@src/utils/types/order-types';
import { LabelTypeClass } from '@src/order-material-columns/domain/order-material-column';

export type NewsRecordsSchemaDocument =
  HydratedDocument<NewsRecordsSchemaClass>;

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    getters: true,
  },
})
export class NewsRecordsSchemaClass extends EntityDocumentHelper {
  @ApiProperty({ type: String })
  @Prop({ type: Types.ObjectId, required: true })
  orderId: Types.ObjectId;

  @ApiProperty({ type: String })
  @Prop({ type: Types.ObjectId, required: true })
  materialId: Types.ObjectId;

  @ApiProperty({ type: String })
  @Prop({ type: String, required: true, enum: NewsActionEnum })
  action: string;

  @ApiProperty({ type: LabelTypeClass })
  @Prop({ type: LabelTypeClass, required: true })
  description: LabelType;

  @ApiProperty()
  @Prop({ default: now })
  createdAt: Date;

  @ApiProperty()
  @Prop({ default: now })
  updatedAt: Date;
}

export const NewsRecordsSchema = SchemaFactory.createForClass(
  NewsRecordsSchemaClass,
);
