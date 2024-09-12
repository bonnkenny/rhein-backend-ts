import { Menu } from '../../../../domain/menu';
import { MenuSchemaClass } from '../entities/menu.schema';

export class MenuMapper {
  public static toDomain(raw: MenuSchemaClass): Menu {
    const domainEntity = new Menu();
    domainEntity.id = raw._id.toString();
    domainEntity.name = raw.name;
    domainEntity.path = raw.path;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  public static toPersistence(domainEntity: Menu): MenuSchemaClass {
    const persistenceSchema = new MenuSchemaClass();
    if (domainEntity.id) {
      persistenceSchema._id = domainEntity.id;
    }
    persistenceSchema.name = domainEntity.name;
    persistenceSchema.path = domainEntity.path;
    persistenceSchema.createdAt = domainEntity.createdAt;
    persistenceSchema.updatedAt = domainEntity.updatedAt;

    return persistenceSchema;
  }
}
