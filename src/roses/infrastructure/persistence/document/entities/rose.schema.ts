import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { now, HydratedDocument, Types } from 'mongoose';
import { EntityDocumentHelper } from '@src/utils/document-entity-helper';
import { ApiProperty } from '@nestjs/swagger';
import { MenuSchemaClass } from '@src/menus/infrastructure/persistence/document/entities/menu.schema';

export type RoseSchemaDocument = HydratedDocument<RoseSchemaClass>;

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    getters: true,
  },
})
export class RoseSchemaClass extends EntityDocumentHelper {
  @ApiProperty()
  @Prop({ required: true })
  name: string;

  @ApiProperty()
  @Prop()
  description: string;

  @ApiProperty()
  @Prop({
    required: true,
    enum: ['admin', 'supplier', 'super'],
    default: 'admin',
  })
  type?: string;

  @ApiProperty()
  @Prop({ type: [{ type: Types.ObjectId, ref: MenuSchemaClass.name }] })
  menus?: Types.ObjectId[];

  @ApiProperty()
  @Prop({ default: now })
  createdAt: Date;

  @ApiProperty()
  @Prop({ default: now })
  updatedAt: Date;
}

export const RoseSchema = SchemaFactory.createForClass(RoseSchemaClass);
