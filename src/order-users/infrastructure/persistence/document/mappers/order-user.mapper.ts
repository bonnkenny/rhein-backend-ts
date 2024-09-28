import { orderUser } from '../../../../domain/order-user';
import { OrderUserSchemaClass } from '../entities/order-user.schema';
import { Types } from 'mongoose';

export class OrderUserMapper {
  public static toDomain(raw: OrderUserSchemaClass): orderUser {
    const domainEntity = new orderUser();
    domainEntity.id = raw._id.toString();
    domainEntity.orderId = raw.orderId.toString();
    domainEntity.userId = raw.userId.toString();
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  public static toPersistence(domainEntity: orderUser): OrderUserSchemaClass {
    const persistenceSchema = new OrderUserSchemaClass();
    if (domainEntity.id) {
      persistenceSchema._id = domainEntity.id;
    }
    persistenceSchema.orderId = new Types.ObjectId(domainEntity.orderId);
    persistenceSchema.userId = new Types.ObjectId(domainEntity.userId);
    persistenceSchema.createdAt = domainEntity.createdAt;
    persistenceSchema.updatedAt = domainEntity.updatedAt;

    return persistenceSchema;
  }
}
