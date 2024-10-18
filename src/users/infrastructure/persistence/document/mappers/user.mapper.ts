import { User } from '@src/users/domain/user';
import { UserSchemaClass } from '../entities/user.schema';
import { FileSchemaClass } from '@src/files/infrastructure/persistence/document/entities/file.schema';
import { FileMapper } from '@src/files/infrastructure/persistence/document/mappers/file.mapper';
import { Types } from 'mongoose';
import { RoleMapper } from '@src/roles/infrastructure/persistence/document/mappers/role.mapper';
// import { toMongoId } from '@src/utils/functions';
// import { findKey } from 'lodash';
// import { UserStatusEnum } from '@src/utils/enums/user-status.enum';

export class UserMapper {
  static toDomain(raw: UserSchemaClass): User {
    const domainEntity = new User();
    domainEntity.id = raw._id.toString();
    domainEntity.email = raw.email;
    domainEntity.password = raw.password;
    domainEntity.previousPassword = raw.previousPassword;
    domainEntity.provider = raw.provider;
    domainEntity.socialId = raw.socialId;
    // domainEntity.firstName = raw.firstName;
    // domainEntity.lastName = raw.lastName;
    domainEntity.username = raw?.username;
    if (raw.avatar) {
      domainEntity.avatar = FileMapper.toDomain({
        path: raw.avatar?.path ?? '',
        _id: raw.avatar?._id ?? '',
        size: raw.avatar?.size ?? 0,
        mime: raw.avatar?.mime ?? '',
        driver: raw.avatar?.driver ?? '',
      });
    } else if (!raw.avatar) {
      domainEntity.avatar = { path: '', id: '' };
    }

    domainEntity.baseRole = raw.baseRole?.toString();
    domainEntity.status = raw.status;

    if (!!raw.roleIds && raw.roleIds.length) {
      domainEntity.roleIds = raw.roleIds.map((roleId) => roleId.toString());
    }

    if (!!raw?.roles && raw.roles.length) {
      domainEntity.roles = raw.roles.map(RoleMapper.toDomain);
    }

    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;
    domainEntity.deletedAt = raw.deletedAt;

    return domainEntity;
  }

  static toPersistence(domainEntity: User): UserSchemaClass {
    let photo: FileSchemaClass | undefined = undefined;

    const persistenceSchema = new UserSchemaClass();
    if (!!domainEntity?.roleIds && domainEntity.roleIds.length) {
      persistenceSchema.roleIds = domainEntity.roleIds.map(
        (v) => new Types.ObjectId(v),
      );
    }
    if (domainEntity.avatar) {
      photo = new FileSchemaClass();
      photo._id = domainEntity.avatar?.id ?? '';
      photo.path = domainEntity.avatar?.path ?? '';
      photo.size = domainEntity.avatar?.size ?? 0;
      photo.mime = domainEntity.avatar?.mime ?? '';
      persistenceSchema.avatar = photo;
    }
    console.log('avatar', persistenceSchema.avatar);

    if (domainEntity.id && typeof domainEntity.id === 'string') {
      persistenceSchema._id = domainEntity.id;
    }
    if (domainEntity.status) persistenceSchema.status = domainEntity.status;
    if (domainEntity.baseRole)
      persistenceSchema.baseRole = domainEntity.baseRole;
    persistenceSchema.email = domainEntity.email;
    persistenceSchema.password = domainEntity.password;
    persistenceSchema.previousPassword = domainEntity.previousPassword;
    persistenceSchema.provider = domainEntity.provider;
    persistenceSchema.socialId = domainEntity.socialId;
    persistenceSchema.username = domainEntity.username;
    // persistenceSchema.role = role;
    // persistenceSchema.status = status;
    persistenceSchema.createdAt = domainEntity.createdAt;
    persistenceSchema.updatedAt = domainEntity.updatedAt;
    persistenceSchema.deletedAt = domainEntity.deletedAt;
    return persistenceSchema;
  }
}
