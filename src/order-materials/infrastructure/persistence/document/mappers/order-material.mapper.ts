import { OrderMaterial } from '../../../../domain/order-material';
import { OrderMaterialSchemaClass } from '../entities/order-material.schema';

export class OrderMaterialMapper {
  public static toDomain(raw: OrderMaterialSchemaClass): OrderMaterial {
    const domainEntity = new OrderMaterial();
    domainEntity.id = raw._id.toString();
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  public static toPersistence(
    domainEntity: OrderMaterial,
  ): OrderMaterialSchemaClass {
    const persistenceSchema = new OrderMaterialSchemaClass();
    if (domainEntity.id) {
      persistenceSchema._id = domainEntity.id;
    }
    persistenceSchema.createdAt = domainEntity.createdAt;
    persistenceSchema.updatedAt = domainEntity.updatedAt;

    return persistenceSchema;
  }
}
