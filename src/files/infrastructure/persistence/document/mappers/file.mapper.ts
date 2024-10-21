import { FileType } from '@src/files/domain/file';
import { FileSchemaClass } from '../entities/file.schema';
import { OssUtils } from '@src/files/infrastructure/uploader/oss/oss.utils';

export class FileMapper {
  static toDomain(raw: FileSchemaClass): FileType {
    const domainEntity = new FileType();
    domainEntity.id = raw._id.toString();
    if (raw.path) {
      // const ossUtils = new OssUtils();
      // domainEntity.path = ossUtils.getSrcSign(
      //   ossUtils.getOssResourcePath(raw.path),
      // );
      domainEntity.path = raw.path;
    }
    domainEntity.mime = raw.mime;
    domainEntity.size = raw.size;
    domainEntity.name = raw.name;
    return domainEntity;
  }
  static toPersistence(domainEntity: FileType): FileSchemaClass {
    const persistenceSchema = new FileSchemaClass();
    if (domainEntity.id) {
      persistenceSchema._id = domainEntity.id;
    }
    if (domainEntity.path) {
      const ossUtils = new OssUtils();
      persistenceSchema.path = ossUtils.getOssResourcePath(domainEntity.path);
    }

    persistenceSchema.size = domainEntity.size;
    persistenceSchema.mime = domainEntity.mime;
    if (domainEntity?.name) {
      persistenceSchema.name = domainEntity.name;
    }
    return persistenceSchema;
  }
}
