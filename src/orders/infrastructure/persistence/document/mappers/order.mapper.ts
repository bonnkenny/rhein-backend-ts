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
    domainEntity.userId = raw?.userId.toString();
    domainEntity.fromUserId = raw?.fromUserId?.toString() || null;
    domainEntity.parentId = null;
    if (raw.parentId) {
      domainEntity.parentId = raw?.parentId?.toString();
    }
    domainEntity.fillStatus = raw.fillStatus;
    domainEntity.checkStatus = raw.checkStatus;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;
    // console.log('order domain', domainEntity);
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
    if (domainEntity.fromUserId) {
      persistenceSchema.fromUserId = new Types.ObjectId(
        domainEntity.fromUserId,
      );
    }
    if (domainEntity.checkStatus) {
      persistenceSchema.checkStatus = domainEntity.checkStatus;
    }
    if (domainEntity.fillStatus) {
      persistenceSchema.fillStatus = domainEntity.fillStatus;
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
