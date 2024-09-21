import { Order } from '../../../../domain/order';
import { OrderSchemaClass } from '../entities/order.schema';
import { OrderTypeEnum } from '@src/utils/enums/order-type.enum';
import { Types } from 'mongoose';
import { findKey } from 'lodash';

export class OrderMapper {
  public static toDomain(raw: OrderSchemaClass): Order {
    const domainEntity = new Order();
    domainEntity.id = raw._id.toString();
    if (raw?.parentId) {
      domainEntity.parentId = raw?.parentId.toString();
    }
    domainEntity.orderNo = raw.orderNo;
    domainEntity.orderName = raw.orderName;
    if (raw.orderType) {
      domainEntity.orderType =
        findKey(OrderTypeEnum, (v) => v === raw.orderType) || '';
    }
    domainEntity.email = raw.email;
    domainEntity.userId = raw?.userId?.toString();
    domainEntity.userId = raw?.userId?.toString();
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  public static toPersistence(domainEntity: Order): OrderSchemaClass {
    const persistenceSchema = new OrderSchemaClass();
    if (domainEntity.id) {
      persistenceSchema._id = domainEntity.id;
    }
    if (domainEntity.parentId) {
      persistenceSchema.parentId = new Types.ObjectId(domainEntity.parentId);
    }
    if (domainEntity.userId) {
      persistenceSchema.userId = new Types.ObjectId(domainEntity.userId);
    }
    persistenceSchema.orderNo = domainEntity.orderNo;
    persistenceSchema.email = domainEntity?.email || '';
    persistenceSchema.orderName = domainEntity.orderName;
    persistenceSchema.orderType = OrderTypeEnum[domainEntity.orderType];
    persistenceSchema.createdAt = domainEntity.createdAt;
    persistenceSchema.updatedAt = domainEntity.updatedAt;
    return persistenceSchema;
  }
}
