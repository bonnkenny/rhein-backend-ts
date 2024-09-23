import { OrderMaterialTemplate } from '@src/order-material-templates/domain/order-material-template';
import { OrderMaterialTemplateSchemaClass } from '../entities/order-material-template.schema';
import { OrderTypeEnum } from '@src/utils/enums/order-type.enum';
import { OrderMaterialColumn } from '@src/order-material-columns/domain/order-material-column';

export class OrderMaterialTemplateMapper {
  public static toDomain(
    raw: OrderMaterialTemplateSchemaClass,
  ): OrderMaterialTemplate {
    const domainEntity = new OrderMaterialTemplate();
    domainEntity.id = raw._id.toString();
    domainEntity.orderType = raw.orderType;
    domainEntity.label = {
      ch: raw.label?.ch ?? '',
      en: raw.label?.en ?? '',
    };
    // console.log('raw columns >>>>> ', raw.columns);
    const domainColumns: Array<Array<OrderMaterialColumn>> = [];
    if (raw?.columns.length) {
      for (const column of raw.columns) {
        const columnArray: OrderMaterialColumn[] = [];
        for (const row of column) {
          const rowI = new OrderMaterialColumn();
          rowI.label = {
            ch: row?.label?.ch ?? '',
            en: row?.label?.en ?? '',
          };
          rowI.prop = row.prop;
          rowI.rules = row.rules?.map((v) => {
            return {
              rule: v.rule,
              message: v.message,
              trigger: v.trigger,
            };
          });
          rowI.value = undefined;
          rowI.valueType = row.valueType;
          // console.log('rowI', rowI);
          columnArray.push(rowI);
        }
        domainColumns.push(columnArray);
      }
    }
    // console.log('domainColumns', domainColumns);
    domainEntity.columns = domainColumns;
    domainEntity.description = {
      ch: raw.description?.ch ?? '',
      en: raw.description?.en ?? '',
    };
    domainEntity.subDescription = null;
    if (raw.subDescription) {
      domainEntity.subDescription = {
        ch: raw.subDescription?.ch ?? '',
        en: raw.subDescription?.en ?? '',
      };
    }
    domainEntity.filledAt = raw.filledAt ?? null;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;
    domainEntity.isOptional = raw.isOptional;

    // console.log('domainEntity', domainEntity);

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

    persistenceSchema.columns = domainEntity.columns;
    persistenceSchema.label = domainEntity.label;
    persistenceSchema.description = domainEntity.description;

    persistenceSchema.subDescription = domainEntity.subDescription ?? null;

    persistenceSchema.filledAt = domainEntity.filledAt ?? null;
    persistenceSchema.isOptional = domainEntity.isOptional ?? false;
    persistenceSchema.createdAt = domainEntity.createdAt;
    persistenceSchema.updatedAt = domainEntity.updatedAt;

    return persistenceSchema;
  }
}
