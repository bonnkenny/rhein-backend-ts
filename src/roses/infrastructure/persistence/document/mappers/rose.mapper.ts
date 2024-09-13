import { Rose } from '@src/roses/domain/rose';
import { RoseSchemaClass } from '../entities/rose.schema';
import { Types } from 'mongoose';
import { MenuMapper } from '@src/menus/infrastructure/persistence/document/mappers/menu.mapper';
// import { ObjectId } from 'mongoose';
// import { MenuSchemaClass } from '@src/menus/infrastructure/persistence/document/entities/menu.schema';

export class RoseMapper {
  public static toDomain(raw: RoseSchemaClass): Rose {
    const domainEntity = new Rose();
    domainEntity.id = raw._id.toString();
    domainEntity.name = raw.name;
    domainEntity.description = raw.description;
    domainEntity.type = raw.type;

    if (raw?.menus && raw.menus.length) {
      domainEntity.menus = raw.menus.map((menu) => menu.toString());
    }
    console.log('raw.menuDocs', raw.menuEntities);
    if (raw?.menuEntities && raw.menuEntities.length) {
      domainEntity.menuEntities = raw.menuEntities.map(MenuMapper.toDomain);
    }
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  public static toPersistence(domainEntity: Rose): RoseSchemaClass {
    const persistenceSchema = new RoseSchemaClass();
    if (domainEntity.id) {
      persistenceSchema._id = domainEntity.id;
    }
    persistenceSchema.name = domainEntity.name;
    persistenceSchema.description = domainEntity?.description ?? '';
    persistenceSchema.type = domainEntity.type;
    // let menu:MenuSchemaClass | undefined = undefined;
    if (domainEntity?.menus?.length) {
      persistenceSchema.menus = domainEntity.menus.map(
        (menu) => new Types.ObjectId(menu),
      );
    }
    persistenceSchema.createdAt = domainEntity.createdAt;
    persistenceSchema.updatedAt = domainEntity.updatedAt;

    console.log('persistenceSchema rose', persistenceSchema);

    return persistenceSchema;
  }
}
