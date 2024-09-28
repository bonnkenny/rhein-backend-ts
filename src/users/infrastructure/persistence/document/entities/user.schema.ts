import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { now, HydratedDocument, Types, Query } from 'mongoose';

// We use class-transformer in schema and domain entity.
// We duplicate these rules because you can choose not to use adapters
// in your project and return an schema entity directly in response.
import { Exclude, Expose, Type } from 'class-transformer';
import { AuthProvidersEnum } from '@src/auth/auth-providers.enum';
import { FileSchemaClass } from '@src/files/infrastructure/persistence/document/entities/file.schema';
import { EntityDocumentHelper } from '@src/utils/document-entity-helper';
import { ApiProperty } from '@nestjs/swagger';
import { BaseRoleEnum } from '@src/utils/enums/base-role.enum';
import { UserStatusEnum } from '@src/utils/enums/user-status.enum';
import { GroupTypesEnum } from '@src/utils/enums/groups.enum';
import { RoleSchemaClass } from '@src/roles/infrastructure/persistence/document/entities/role.schema';

export type UserSchemaDocument = HydratedDocument<UserSchemaClass>;

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    getters: true,
  },
})
export class UserSchemaClass extends EntityDocumentHelper {
  @ApiProperty({
    type: String,
    example: 'john.doe@example.com',
  })
  @Prop({
    type: String,
  })
  @Expose({
    groups: [GroupTypesEnum.ADMIN, GroupTypesEnum.ME],
    toPlainOnly: true,
  })
  email: string | null;

  @Exclude({ toPlainOnly: true })
  @Prop()
  password?: string;

  @Exclude({ toPlainOnly: true })
  previousPassword?: string;

  @ApiProperty({
    type: String,
    example: 'email',
  })
  @Expose({
    groups: [GroupTypesEnum.ADMIN, GroupTypesEnum.ME],
    toPlainOnly: true,
  })
  @Prop({
    default: AuthProvidersEnum.email,
  })
  provider: string;

  @ApiProperty({
    type: String,
    example: '1234567890',
  })
  @Expose({
    groups: [GroupTypesEnum.ADMIN, GroupTypesEnum.ME],
    toPlainOnly: true,
  })
  @Prop({
    type: String,
    default: null,
  })
  socialId?: string | null;

  @ApiProperty({
    type: String,
    example: 'John',
  })
  @Prop({
    type: String,
  })
  firstName: string | null;

  @ApiProperty({
    type: String,
    example: 'Doe',
  })
  @Prop({
    type: String,
  })
  lastName: string | null;

  @ApiProperty({
    type: String,
    example: 'John Doe',
  })
  @Prop({ type: String, maxlength: 50 })
  username: string;

  @ApiProperty({
    type: () => FileSchemaClass,
  })
  @Prop({
    type: FileSchemaClass,
  })
  @Type(() => FileSchemaClass)
  avatar?: FileSchemaClass | null;

  @ApiProperty({
    type: String,
    enum: Object.values(BaseRoleEnum),
  })
  @Prop({
    type: String,
    default: BaseRoleEnum.ADMIN,
    nullable: false,
  })
  baseRole: string;

  @ApiProperty({ type: Number, enum: Object.values(UserStatusEnum) })
  @Prop({
    type: String,
    default: UserStatusEnum.ACTIVE,
    nullable: false,
  })
  status: string;

  @ApiProperty()
  @Prop({
    type: [{ type: Types.ObjectId, ref: RoleSchemaClass.name }],
    default: [],
  })
  roleIds: Types.ObjectId[];

  @ApiProperty()
  roles?: RoleSchemaClass[];

  @ApiProperty()
  @Prop({ default: now })
  createdAt: Date;

  @ApiProperty()
  @Prop({ default: now })
  updatedAt: Date;

  @ApiProperty()
  @Prop()
  deletedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(UserSchemaClass);

// soft delete
UserSchema.pre<Query<UserSchemaClass, Document>>(/^find|count/, function () {
  this.where({ deletedAt: null }); // 自动过滤已删除文档
});

UserSchema.index({ baseRole: 1 });
UserSchema.index({ email: 1, deletedAt: 1, baseRole: 1 }, { unique: true });

UserSchema.virtual('previousPassword').get(function () {
  return this.password;
});
// UserSchema.virtual('username').get(function () {
//   return `${this.firstName} ${this.lastName}`;
// });
UserSchema.virtual('roles', {
  ref: RoleSchemaClass.name,
  localField: 'roleIds',
  foreignField: '_id',
  justOne: false,
});
