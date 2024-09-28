import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { now, HydratedDocument, Types } from 'mongoose';
import { EntityDocumentHelper } from '@src/utils/document-entity-helper';
import { ApiProperty } from '@nestjs/swagger';

export type orderUserSchemaDocument = HydratedDocument<orderUserSchemaClass>;

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    getters: true,
  },
})
export class orderUserSchemaClass extends EntityDocumentHelper {
  @Prop({ type: Types.ObjectId, nullable: false })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, nullable: false })
  orderId: Types.ObjectId;

  @ApiProperty()
  @Prop({ default: now })
  createdAt: Date;

  @ApiProperty()
  @Prop({ default: now })
  updatedAt: Date;
}

export const orderUserSchema =
  SchemaFactory.createForClass(orderUserSchemaClass);

orderUserSchema.index({ userId: 1, orderId: 1 }, { unique: true });
