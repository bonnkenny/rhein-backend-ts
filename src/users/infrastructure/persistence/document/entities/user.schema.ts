import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { now, HydratedDocument } from 'mongoose';

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
    unique: true,
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
    type: () => FileSchemaClass,
  })
  @Prop({
    type: FileSchemaClass,
  })
  @Type(() => FileSchemaClass)
  photo?: FileSchemaClass | null;

  @ApiProperty({
    type: Number,
    enum: Object.values(BaseRoleEnum),
  })
  @Prop({
    type: Number,
    default: BaseRoleEnum.ADMIN,
    nullable: false,
  })
  baseRole: number;

  @ApiProperty({ type: Number, enum: Object.values(UserStatusEnum) })
  @Prop({
    type: Number,
    default: UserStatusEnum.ACTIVE,
    nullable: false,
  })
  status: number;
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

UserSchema.virtual('previousPassword').get(function () {
  return this.password;
});

UserSchema.index({ 'role._id': 1 });
