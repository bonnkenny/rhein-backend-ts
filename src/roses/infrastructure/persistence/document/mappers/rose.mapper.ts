import { Rose } from '@src/roses/domain/rose';
import { RoseSchemaClass } from '../entities/rose.schema';
// import { ObjectId } from 'mongoose';
// import { MenuSchemaClass } from '@src/menus/infrastructure/persistence/document/entities/menu.schema';

export class RoseMapper {
  public static toDomain(raw: RoseSchemaClass): Rose {
    const domainEntity = new Rose();
    domainEntity.id = raw._id.toString();
    domainEntity.name = raw.name;
    domainEntity.description = raw.description;
    domainEntity.type = raw.type;
    console.log('raw.menus', raw.menus);
    if (raw?.menus && raw.menus.length) {
      domainEntity.menus = raw.menus.map((menu) => menu.toString());
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
    persistenceSchema.createdAt = domainEntity.createdAt;
    persistenceSchema.updatedAt = domainEntity.updatedAt;

    return persistenceSchema;
  }
}
