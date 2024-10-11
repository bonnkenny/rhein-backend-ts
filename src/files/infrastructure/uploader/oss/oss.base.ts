import { OSSOptions } from './oss.provider';
import * as stream from 'stream';
import moment from 'moment';
import OSS from 'ali-oss';
import { Inject, UnprocessableEntityException } from '@nestjs/common';
import { random } from 'lodash';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import { OssUtils } from '@src/files/infrastructure/uploader/oss/oss.utils';

export interface UploadResult {
  uploaded: boolean;
  path: string;
  src: string;
  srcSign: string;
  message: string;
}

// export interface File {
//   fieldname: string;
//   originalname: string;
//   encoding: string;
//   mimetype: string;
//   buffer: Buffer;
//   size: number;
// }

export interface OSSSuccessResponse {
  name: string;
  url?: string;
  res: OSS.NormalSuccessResponse;
  size?: number;
  aborted?: boolean;
  rt?: number;
  keepAliveSocket?: boolean;
  data?: Buffer;
  requestUrls?: string[];
  timing?: null;
  remoteAddress?: string;
  remotePort?: number;
  socketHandledRequests?: number;
  socketHandledResponses?: number;
}

export interface ClientSign {
  name?: string;
  key?: string;
  policy: string;
  OSSAccessKeyId: string;
  success_action_status?: number;
  signature: string;
}

export class OSSBase {
  protected ossClient: OSS;
  protected options: OSSOptions;
  protected version = parseFloat(process.versions.node);

  @Inject(OssUtils) protected ossUtils: OssUtils;

  /**
   * 流式上传
   * @param target
   * @param imageStream
   */
  protected async putStream(
    target: string,
    imageStream: stream.PassThrough,
  ): Promise<OSSSuccessResponse> {
    return await this.ossClient.putStream(target, imageStream);
  }

  /**
   * 上传到OSS
   * @param file
   */
  protected async uploadOSS(file: Express.Multer.File[] | Express.Multer.File) {
    const result: UploadResult[] = [];
    let files: Express.Multer.File[] = [];

    if (Array.isArray(file)) {
      files = file;
    } else {
      files = [file];
    }

    if (files && files.length > 0) {
      for (const item of files) {
        const filename = this.getImgName(item.originalname);
        const imgPath = `images/${moment().format('YYYYMMDD')}`;
        const target = imgPath + '/' + filename;
        const info: UploadResult = {
          uploaded: true,
          path: '',
          src: '',
          srcSign: '',
          message: 'Ok',
        };

        try {
          const imageStream = new stream.PassThrough();
          imageStream.end(item.buffer);
          const uploadResult = await this.putStream(target, imageStream);

          if (uploadResult.res.status === 200) {
            info.path = uploadResult.name;
            info.src = uploadResult.url || '';
            info.srcSign = this.ossUtils.getOssSign(info.src);
          }
        } catch (error) {
          console.error('error', error);
          throw new UnprocessableEntityException({
            message: 'Upload fail!',
            errors: {
              oss: error.message,
            },
          });
        }

        result.push(info);
      }
    }

    return result;
  }

  /**
   * 生成文件名(按时间)
   * @param {*} filename
   */
  protected getImgName(filename: string) {
    // const uuid = uuidv4();
    // const name = createHash('md5').update(uuid).digest('hex');

    const name = randomStringGenerator();
    return `${name}${random(1000, 9999)}.${filename.split('.').pop()?.toLowerCase()}`;
  }

  /**
   * 获取私密bucket访问地址
   * @param {*} url
   * @param {*} width
   * @param {*} height
   */
  // public getOssSign(url: string, width?: number, height?: number) {
  //   let target = url;
  //   // 拼装签名后访问地址
  //   let urlReturn = '';
  //
  //   if (url) {
  //     const isSelfUrl = `${this.options.client.bucket}.${this.options.client.endpoint}`;
  //     const isSelfUrlX: string = this.options.domain || '';
  //
  //     // 判断是否包含有效地址
  //     if (url.indexOf(isSelfUrl) > 0 || url.indexOf(isSelfUrlX) > 0) {
  //       let targetArray: string[] = [];
  //       if (url.indexOf('?') > 0) {
  //         targetArray = url.split('?');
  //         target = targetArray[0];
  //       }
  //       targetArray = target.split('com/');
  //       target = targetArray[1];
  //     } else {
  //       return url;
  //     }
  //     // 读取配置初始化参数
  //     const accessId = this.options.client.accessKeyId;
  //     const accessKey = this.options.client.accessKeySecret;
  //     let endpoint = `${this.options.client.bucket}.${this.options.client.endpoint}`;
  //     const signDateTime = parseInt(moment().format('X'), 10);
  //     const outTime = 2 * 3600; // 失效时间
  //     const expireTime = signDateTime + outTime;
  //
  //     if (this.options.domain) {
  //       endpoint = this.options.domain;
  //     }
  //
  //     // 拼装签名字符串
  //     let toSignString = '';
  //     toSignString = 'GET\n';
  //     const md5 = '';
  //     toSignString = `${toSignString}${md5}\n`;
  //     const contentType = '';
  //     toSignString = `${toSignString}${contentType}\n`;
  //     toSignString = `${toSignString}${expireTime}\n`;
  //     let resource = '';
  //
  //     if (width && height) {
  //       resource = `/${this.options.client.bucket}/${target}?x-oss-process=image/resize,m_fill,w_${width},h_${height},limit_0`;
  //     } else {
  //       resource = `/${this.options.client.bucket}/${target}`;
  //     }
  //
  //     const ossHeaders = '';
  //     toSignString = toSignString + ossHeaders;
  //     toSignString = toSignString + resource;
  //
  //     // hmacsha1 签名
  //     const sign = encodeURIComponent(
  //       createHmac('sha1', accessKey).update(toSignString).digest('base64'),
  //     );
  //
  //     if (width && height) {
  //       urlReturn = `https://${endpoint}/${target}?x-oss-process=image/resize,m_fill,w_${width},h_${height},limit_0&OSSAccessKeyId=${accessId}&Expires=${expireTime}&Signature=${sign}`;
  //     } else {
  //       urlReturn = `https://${endpoint}/${target}?OSSAccessKeyId=${accessId}&Expires=${expireTime}&Signature=${sign}`;
  //     }
  //   }
  //
  //   return urlReturn;
  // }

  /**
   * 前端直传签名
   */
  // public getUploadSign() {
  //   const policyText = {
  //     expiration: `${moment().add(1, 'hours').format('YYYY-MM-DDTHH:mm:ss')}.000Z`, // 设置Policy的失效时间
  //     conditions: [
  //       ['content-length-range', 0, 50048576000], // 设置上传文件的大小限制
  //     ],
  //   };
  //   const policyBase64 = Buffer.from(JSON.stringify(policyText)).toString(
  //     'base64',
  //   );
  //   const uploadSignature = createHmac(
  //     'sha1',
  //     this.options.client.accessKeySecret,
  //   )
  //     .update(policyBase64)
  //     .digest('base64');
  //
  //   const params: ClientSign = {
  //     policy: policyBase64,
  //     OSSAccessKeyId: this.options.client.accessKeyId,
  //     signature: uploadSignature,
  //   };
  //
  //   return params;
  // }
}
