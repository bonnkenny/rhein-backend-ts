import { orderUser } from '../../../../domain/order-user';
import { orderUserSchemaClass } from '../entities/order-user.schema';
import { Types } from 'mongoose';

export class orderUserMapper {
  public static toDomain(raw: orderUserSchemaClass): orderUser {
    const domainEntity = new orderUser();
    domainEntity.id = raw._id.toString();
    domainEntity.orderId = raw.orderId.toString();
    domainEntity.userId = raw.userId.toString();
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  public static toPersistence(domainEntity: orderUser): orderUserSchemaClass {
    const persistenceSchema = new orderUserSchemaClass();
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
