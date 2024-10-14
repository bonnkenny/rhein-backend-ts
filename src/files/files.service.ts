import { Inject, Injectable } from '@nestjs/common';

import { FileRepository } from './infrastructure/persistence/file.repository';
import { FileType } from './domain/file';
import { NullableType } from '../utils/types/nullable.type';
import { OssUtils } from '@src/files/infrastructure/uploader/oss/oss.utils';

@Injectable()
export class FilesService {
  constructor(
    private readonly fileRepository: FileRepository,
    @Inject(OssUtils) readonly ossUtils: OssUtils,
  ) {}

  findById(id: FileType['id']): Promise<NullableType<FileType>> {
    return this.fileRepository.findById(id);
  }

  findByPath(path: FileType['path']): Promise<NullableType<FileType>> {
    const ossResourcePath = this.ossUtils.getOssResourcePath(path);
    return this.fileRepository.findByFilter({ path: ossResourcePath });
  }
}
