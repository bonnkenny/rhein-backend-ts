import {
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { FilesOssService } from './files.service';
import { ApiTags } from '@nestjs/swagger';

/**
 * AppController
 * @export
 * @class AppControllerr
 */
@ApiTags('Files')
@Controller({
  path: 'files',
  version: '1',
})
export class FilesOssController {
  constructor(private readonly oSSService: FilesOssService) {}

  /**
   * 多文件上传oss
   */
  @Post('upload')
  @UseInterceptors(FilesInterceptor('file'))
  public async uploadFile(@UploadedFiles() file: Express.Multer.File) {
    return await this.oSSService.upload(file);
    // result [
    // 	{
    // 		uploaded: true,
    // 		path: 'images/20191115/16420962.png',
    // 		src: 'http://xxxx.oss-cn-shenzhen.aliyuncs.com/images/20191115/16420962.png',
    // 		srcSign: 'https://xxx.oss-cn-shenzhen.aliyuncs.com/images/20191115/16420962.png?OSSAccessKeyId=LTAI6lgwcBcCbiKX&Expires=1573814530&Signature=brYN7qbDdyxGARc%2BdoRsnblJx2w%3D',
    // 		message: '上传成功'
    // 	}
    // ]
  }
}
