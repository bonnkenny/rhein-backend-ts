import { OrderMaterialTemplate } from '@src/order-material-templates/domain/order-material-template';
import { OrderMaterialTemplateSchemaClass } from '../entities/order-material-template.schema';
import { findKey } from 'lodash';
import { OrderTypeEnum } from '@src/utils/enums/order-type.enum';

export class OrderMaterialTemplateMapper {
  public static toDomain(
    raw: OrderMaterialTemplateSchemaClass,
  ): OrderMaterialTemplate {
    const domainEntity = new OrderMaterialTemplate();
    domainEntity.id = raw._id.toString();
    domainEntity.orderType =
      findKey(OrderTypeEnum, raw.orderType)?.toString() || '';

    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  public static toPersistence(
    domainEntity: OrderMaterialTemplate,
  ): OrderMaterialTemplateSchemaClass {
    const persistenceSchema = new OrderMaterialTemplateSchemaClass();
    if (domainEntity.id && typeof domainEntity.id === 'string') {
      persistenceSchema._id = domainEntity.id;
    }

    if (domainEntity.orderType) {
      persistenceSchema.orderType = OrderTypeEnum[domainEntity.orderType];
    }
    persistenceSchema.createdAt = domainEntity.createdAt;
    persistenceSchema.updatedAt = domainEntity.updatedAt;

    return persistenceSchema;
  }
}
