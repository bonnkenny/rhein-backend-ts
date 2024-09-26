import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { now, HydratedDocument, Types, Query } from 'mongoose';
import { EntityDocumentHelper } from '@src/utils/document-entity-helper';
import { ApiProperty } from '@nestjs/swagger';
import { MenuSchemaClass } from '@src/menus/infrastructure/persistence/document/entities/menu.schema';
import { BaseRoleEnum } from '@src/utils/enums/base-role.enum';
import { UserStatusEnum } from '@src/utils/enums/user-status.enum';

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

  @Prop({ type: String, enum: UserStatusEnum, default: UserStatusEnum.ACTIVE })
  status: string;

  @ApiProperty()
  @Prop({ type: [{ type: Types.ObjectId, ref: MenuSchemaClass.name }] })
  menuIds?: Types.ObjectId[];

  menus?: MenuSchemaClass[];

  @ApiProperty()
  @Prop({ default: null })
  deletedAt: Date;

  @ApiProperty()
  @Prop({ default: now })
  createdAt: Date;

  @ApiProperty()
  @Prop({ default: now })
  updatedAt: Date;
}

export const RoleSchema = SchemaFactory.createForClass(RoleSchemaClass);

// soft delete
RoleSchema.pre<Query<RoleSchemaClass, Document>>(/^find/, function () {
  this.where({ deletedAt: null }); // 自动过滤已删除文档
});

RoleSchema.virtual('menus', {
  ref: MenuSchemaClass.name,
  localField: 'menuIds',
  foreignField: '_id',
  justOne: false,
});

RoleSchema.path('type').get(function (v) {
  return BaseRoleEnum[v] ?? undefined;
});
