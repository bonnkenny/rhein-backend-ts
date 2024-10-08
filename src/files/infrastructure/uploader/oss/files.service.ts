import { Injectable, Inject } from '@nestjs/common';
import { DeleteMultiResult } from 'ali-oss';
import { OSS_CONST, OSS_OPTIONS, OSSOptions } from './oss.provider';
import { OSSBase, UploadResult } from './oss.base';
import OSS from 'ali-oss';

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

  /**
   * 上传
   * @param files
   */
  public async upload(
    files: Express.Multer.File[] | Express.Multer.File,
  ): Promise<UploadResult[]> {
    //if (this.version >= 11.7 && this.options.multi) {
    //    return await this.uploadOSSMuit(files);
    //} else {
    return await this.uploadOSS(files);
    //}
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
