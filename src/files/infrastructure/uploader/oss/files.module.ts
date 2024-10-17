import {
  // HttpStatus,
  Module,
  UnprocessableEntityException,
} from '@nestjs/common';
import { FilesOssController } from './files.controller';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule, ConfigService } from '@nestjs/config';
import multer from 'multer';

import { FilesOssService } from './files.service';
import { DocumentFilePersistenceModule } from '../../persistence/document/document-persistence.module';
import { AllConfigType } from '@src/config/config.type';
import {
  OSS_OPTIONS,
  OSSOptions,
  ossProvider,
} from '@src/files/infrastructure/uploader/oss/oss.provider';
import { OssUtils } from '@src/files/infrastructure/uploader/oss/oss.utils';

@Module({
  imports: [
    DocumentFilePersistenceModule,
    MulterModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService<AllConfigType>) => {
        return {
          fileFilter: (request, file, callback) => {
            console.log('file originalname ->', file?.originalname);
            if (!file.originalname.match(/\.(jpg|jpeg|png|pdf)$/i)) {
              return callback(
                new UnprocessableEntityException({
                  // status: HttpStatus.UNPROCESSABLE_ENTITY,
                  success: false,
                  errors: {
                    file: `Can't upload file type`,
                  },
                }),
                false,
              );
            }
            callback(null, true);
          },
          storage: multer.memoryStorage(),
          limits: {
            fileSize: configService.get('file.maxFileSize', { infer: true }),
          },
        };
      },
    }),
  ],
  controllers: [FilesOssController],
  providers: [
    ossProvider(),
    {
      provide: OSS_OPTIONS,
      inject: [ConfigService],
      useFactory: (configService: ConfigService<AllConfigType>): OSSOptions => {
        return {
          client: {
            accessKeyId:
              configService.get('file.accessKeyId', { infer: true }) || '',
            accessKeySecret:
              configService.get('file.secretAccessKey', {
                infer: true,
              }) || '',
            bucket: configService.get('file.ossBucket', { infer: true }),
            endpoint: configService.get('file.ossEndpoint', { infer: true }),
            timeout: '90s',
          },
        };
      },
    },
    FilesOssService,
    OssUtils,
  ],
  exports: [FilesOssService, OssUtils],
})
export class FilesOssModule {}
