import { Order } from '../../../../domain/order';
import { OrderSchemaClass } from '../entities/order.schema';

export class OrderMapper {
  public static toDomain(raw: OrderSchemaClass): Order {
    const domainEntity = new Order();
    domainEntity.id = raw._id.toString();
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  public static toPersistence(domainEntity: Order): OrderSchemaClass {
    const persistenceSchema = new OrderSchemaClass();
    if (domainEntity.id) {
      persistenceSchema._id = domainEntity.id;
    }
    persistenceSchema.createdAt = domainEntity.createdAt;
    persistenceSchema.updatedAt = domainEntity.updatedAt;

    return persistenceSchema;
  }
}
