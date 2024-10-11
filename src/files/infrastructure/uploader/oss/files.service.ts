import { Injectable, Inject } from '@nestjs/common';
import { DeleteMultiResult } from 'ali-oss';
import { OSS_CONST, OSS_OPTIONS, OSSOptions } from './oss.provider';
import { OSSBase, UploadResult } from './oss.base';
import OSS from 'ali-oss';
import { FileRepository } from '@src/files/infrastructure/persistence/file.repository';
import { FileType } from '@src/files/domain/file';

/**
 * OSS
 * @export
 * @class FilesOssService
 */
@Injectable()
export class FilesOssService extends OSSBase {
  constructor(
    @Inject(OSS_CONST) protected readonly ossClient: OSS,
    @Inject(OSS_OPTIONS) protected readonly options: OSSOptions,
    private readonly fileRepository: FileRepository,
  ) {
    super();
  }

  /**
   * 流式下载
   * @param target
   */
  public async getStream(target: string): Promise<OSS.GetStreamResult> {
    return await this.ossClient.getStream(target);
  }

  /**
   * 删除
   * @param target
   */
  public async delete(target: string): Promise<OSS.DeleteResult> {
    return await this.ossClient.delete(target);
  }

  /**
   * 批量删除
   * @param targets
   */
  public async deleteMulti(targets: string[]): Promise<DeleteMultiResult> {
    return await this.ossClient.deleteMulti(targets);
  }

  public async upload(file: Express.Multer.File): Promise<FileType> {
    const size = file.size;
    const mimetype = file.mimetype;
    console.log('file ->', file);
    console.log('file size ->', size);
    console.log('file mime ->', mimetype);
    const result: UploadResult[] = await this.uploadOSS(file);
    if (result.length > 0) {
      const fileInfo: UploadResult = result[0];
      const saveData = {
        path: fileInfo.path,
        size: size,
        mime: mimetype,
      };
      console.log('upload ret ->', fileInfo);
      console.log('save-data ->', saveData);
      return this.fileRepository.create(saveData);
    } else {
      throw new Error('upload failed');
    }
  }

  /**
   * 上传到OSS(多线程并行上传)
   * @param file
   */
  // private async uploadOSSMuit(files: File[]): Promise<UploadResult[]> {
  //     const result: UploadResult[] = await threadpool.sendData(files);

  //     return result;
  // }

  /**
   * 结束上传进程(仅作为单元测试结束调用)
   */
  // public endThread() {
  //     threadpool.endThread();
  // }
}
