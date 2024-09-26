import { Role } from '@src/roles/domain/role';
import { RoleSchemaClass } from '../entities/role.schema';
import { MenuMapper } from '@src/menus/infrastructure/persistence/document/mappers/menu.mapper';
import { Types } from 'mongoose';
import { BaseRoleEnum } from '@src/utils/enums/base-role.enum';

export class RoleMapper {
  public static toDomain(raw: RoleSchemaClass): Role {
    const domainEntity = new Role();
    domainEntity.id = raw._id.toString();
    domainEntity.name = raw.name;
    domainEntity.description = raw.description;
    domainEntity.type = raw.type;
    // console.log('domain,type', domainEntity.type);
    // console.log('raw,type', raw.type);
    if (raw?.menuIds && raw.menuIds.length) {
      domainEntity.menuIds = raw.menuIds.map((menu) => menu.toString());
    }
    console.log('raw.menus', raw.menuIds);
    if (raw?.menus && raw.menus.length) {
      domainEntity.menus = raw.menus.map(MenuMapper.toDomain);
    }
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  public static toPersistence(domainEntity: Role): RoleSchemaClass {
    const persistenceSchema = new RoleSchemaClass();
    if (domainEntity.id) {
      persistenceSchema._id = domainEntity.id;
    }

    persistenceSchema.name = domainEntity.name;
    persistenceSchema.description = domainEntity?.description ?? '';
    if (!!domainEntity?.type) {
      persistenceSchema.type = BaseRoleEnum[domainEntity.type];
    }
    // let menu:MenuSchemaClass | undefined = undefined;
    if (domainEntity?.menuIds?.length) {
      persistenceSchema.menuIds = domainEntity.menuIds.map(
        (menu) => new Types.ObjectId(menu),
      );
    }
    persistenceSchema.createdAt = domainEntity.createdAt;
    persistenceSchema.updatedAt = domainEntity.updatedAt;

    return persistenceSchema;
  }
}
