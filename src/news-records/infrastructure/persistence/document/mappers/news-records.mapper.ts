import { NewsRecords } from '../../../../domain/news-records';
import { NewsRecordsSchemaClass } from '../entities/news-records.schema';
import { toMongoId } from '@src/utils/functions';

export class NewsRecordsMapper {
  public static toDomain(raw: NewsRecordsSchemaClass): NewsRecords {
    const domainEntity = new NewsRecords();
    domainEntity.id = raw._id.toString();
    domainEntity.orderId = raw.orderId.toString();
    domainEntity.materialId = raw.materialId.toString();
    domainEntity.description = {
      en: raw?.description?.en,
      ch: raw?.description?.ch,
    };
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  public static toPersistence(
    domainEntity: NewsRecords,
  ): NewsRecordsSchemaClass {
    const persistenceSchema = new NewsRecordsSchemaClass();
    if (domainEntity.id) {
      persistenceSchema._id = domainEntity.id;
    }
    persistenceSchema.orderId = toMongoId(domainEntity.orderId);
    persistenceSchema.materialId = toMongoId(domainEntity.materialId);
    persistenceSchema.description = domainEntity.description;
    persistenceSchema.createdAt = domainEntity.createdAt;
    persistenceSchema.updatedAt = domainEntity.updatedAt;

    return persistenceSchema;
  }
}
