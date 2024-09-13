import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { now, HydratedDocument, model } from 'mongoose';
import { EntityDocumentHelper } from '../../../../../utils/document-entity-helper';
import { ApiProperty } from '@nestjs/swagger';

export type MenuSchemaDocument = HydratedDocument<MenuSchemaClass>;

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    getters: true,
  },
})
export class MenuSchemaClass extends EntityDocumentHelper {
  @ApiProperty()
  @Prop({ required: true })
  name: string;

  @ApiProperty()
  @Prop({ required: true })
  path: string;

  @ApiProperty()
  @Prop({ default: now })
  createdAt: Date;

  @ApiProperty()
  @Prop({ default: now })
  updatedAt: Date;
}

export const MenuSchema = SchemaFactory.createForClass(MenuSchemaClass);

export const MenuModel = model<MenuSchemaClass>('Menu', MenuSchema);
