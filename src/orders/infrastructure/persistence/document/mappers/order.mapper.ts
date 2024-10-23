import { Order } from '../../../../domain/order';
import { OrderSchemaClass } from '../entities/order.schema';
import { OrderTypeEnum } from '@src/utils/enums/order-type.enum';
import { Types } from 'mongoose';
import { findKey, isBoolean, omit, pick } from 'lodash';
import { OrderMaterialMapper } from '@src/order-materials/infrastructure/persistence/document/mappers/order-material.mapper';
import { OrderMaterialChainMapper } from '@src/order-materials/infrastructure/persistence/document/mappers/order-material-chain.mapper';
import { UserMapper } from '@src/users/infrastructure/persistence/document/mappers/user.mapper';
import { OrderMaterialExportMapper } from '@src/order-materials/infrastructure/persistence/document/mappers/order-material-export.mapper';

export class OrderMapper {
  public static toDomain(raw: OrderSchemaClass, columnDomain?: string): Order {
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

    if (raw.materials) {
      if (columnDomain === 'chain') {
        const materialLines = raw.materials.map((item) => {
          return OrderMaterialChainMapper.toDomain(omit(item, ['order']));
        });
        // console.log('materialLines', materialLines);
        const lines: Array<string> = [];
        for (const item in materialLines) {
          // console.log('item -> ', item);
          if (materialLines[item].length) {
            for (let i = 0; i < materialLines[item].length; i++) {
              lines.push(materialLines[item][i]);
            }
          }
        }
        domainEntity.nodeLines = lines;
      } else if (columnDomain === 'export') {
        // 此条件暂时废弃
        const materialLines = raw.materials.map((item) => {
          return OrderMaterialExportMapper.toDomain(item);
        });

        const lines: Array<string> = [];
        for (const item in materialLines) {
          // console.log('item -> ', item);
          if (materialLines[item].length) {
            for (let i = 0; i < materialLines[item].length; i++) {
              lines.push(materialLines[item][i]);
            }
          }
        }
        domainEntity.nodeFiles = lines;
      } else {
        domainEntity.materials = raw.materials.map((item) => {
          return OrderMaterialMapper.toDomain(omit(item, ['order']));
        });
      }
    }
    if (raw.user) {
      domainEntity.user = pick(UserMapper.toDomain(raw.user), [
        'username',
        'email',
        'id',
      ]);
    }
    if (raw.fromUser) {
      domainEntity.fromUser = pick(UserMapper.toDomain(raw.fromUser), [
        'username',
        'email',
        'id',
      ]);
    }
    domainEntity.proxySet = raw?.proxySet ?? false;
    domainEntity.fillStatus = raw.fillStatus;
    domainEntity.customerOptionalCheck = raw.customerOptionalCheck ?? null;
    domainEntity.customerOptionalReason = raw.customerOptionalReason ?? null;
    domainEntity.checkStatus = raw.checkStatus;
    domainEntity.status = raw.status;
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

    if (isBoolean(domainEntity?.proxySet)) {
      persistenceSchema.proxySet = domainEntity.proxySet;
    }
    if (domainEntity.customerOptionalCheck) {
      persistenceSchema.customerOptionalCheck =
        domainEntity.customerOptionalCheck;
    }
    if (domainEntity.customerOptionalReason) {
      persistenceSchema.customerOptionalReason =
        domainEntity.customerOptionalReason;
    }
    if (domainEntity.status) {
      persistenceSchema.status = domainEntity.status;
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
