import { FileType } from '@src/files/domain/file';
import { FileSchemaClass } from '../entities/file.schema';

export class FileMapper {
  static toDomain(raw: FileSchemaClass): FileType {
    const domainEntity = new FileType();
    domainEntity.id = raw._id.toString();
    domainEntity.path = raw.path;
    domainEntity.mime = raw.mime;
    domainEntity.size = raw.size;
    return domainEntity;
  }
  static toPersistence(domainEntity: FileType): FileSchemaClass {
    const persistenceSchema = new FileSchemaClass();
    if (domainEntity.id) {
      persistenceSchema._id = domainEntity.id;
    }
    persistenceSchema.path = domainEntity.path;
    persistenceSchema.size = domainEntity.size;
    persistenceSchema.mime = domainEntity.mime;
    return persistenceSchema;
  }
}
