import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { now, HydratedDocument, Types } from 'mongoose';
import { EntityDocumentHelper } from '@src/utils/document-entity-helper';
import { ApiProperty } from '@nestjs/swagger';
import { MenuSchemaClass } from '@src/menus/infrastructure/persistence/document/entities/menu.schema';
import { BaseRoleEnum } from '@src/utils/enums/base-role.enum';

export type RoleSchemaDocument = HydratedDocument<RoleSchemaClass>;

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    getters: true,
  },
})
export class RoleSchemaClass extends EntityDocumentHelper {
  @ApiProperty()
  @Prop({ required: true })
  name: string;

  @ApiProperty()
  @Prop()
  description: string;

  @ApiProperty()
  @Prop({
    required: true,
    type: String,
    enum: Object.values(BaseRoleEnum),
    default: BaseRoleEnum.ADMIN,
  })
  type: string;

  @ApiProperty()
  @Prop({ type: [{ type: Types.ObjectId, ref: MenuSchemaClass.name }] })
  menuIds?: Types.ObjectId[];

  menus?: MenuSchemaClass[];

  @ApiProperty()
  @Prop({ default: now })
  createdAt: Date;

  @ApiProperty()
  @Prop({ default: now })
  updatedAt: Date;
}

export const RoleSchema = SchemaFactory.createForClass(RoleSchemaClass);

RoleSchema.virtual('menus', {
  ref: MenuSchemaClass.name,
  localField: 'menuIds',
  foreignField: '_id',
  justOne: false,
});

RoleSchema.path('type').get(function (v) {
  return BaseRoleEnum[v] ?? undefined;
});
