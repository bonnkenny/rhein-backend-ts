import { Module } from '@nestjs/common';

import { DocumentFilePersistenceModule } from './infrastructure/persistence/document/document-persistence.module';
import { FilesService } from './files.service';
import fileConfig from './config/file.config';
import { FileConfig, FileDriver } from './config/file-config.type';
import { FilesLocalModule } from './infrastructure/uploader/local/files.module';
import { FilesS3Module } from './infrastructure/uploader/s3/files.module';
import { FilesS3PresignedModule } from './infrastructure/uploader/s3-presigned/files.module';
import { FilesOssModule } from '@src/files/infrastructure/uploader/oss/files.module';

const infrastructurePersistenceModule = DocumentFilePersistenceModule;

const infrastructureUploaderModule = () => {
  const driver = (fileConfig() as FileConfig).driver;
  switch (true) {
    case driver === FileDriver.LOCAL:
      return FilesLocalModule;
    case driver === FileDriver.S3:
      return FilesS3Module;
    case driver === FileDriver.OSS:
      return FilesOssModule;
    default:
      return FilesS3PresignedModule;
  }
};
// (fileConfig() as FileConfig).driver === FileDriver.LOCAL
//   ? FilesLocalModule
//   : (fileConfig() as FileConfig).driver === FileDriver.S3
//     ? FilesS3Module
//     : FilesS3PresignedModule;

@Module({
  imports: [infrastructurePersistenceModule, infrastructureUploaderModule()],
  providers: [FilesService],
  exports: [FilesService, infrastructurePersistenceModule],
})
export class FilesModule {}
