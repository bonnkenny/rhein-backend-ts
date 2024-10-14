import { createHmac } from 'crypto';
import { OSSOptions } from './oss.provider';
import moment from 'moment';
import { Injectable } from '@nestjs/common';
import fileConfig from '@src/files/config/file.config';
import { FileConfig } from '@src/files/config/file-config.type';

export interface ClientSign {
  name?: string;
  key?: string;
  policy: string;
  OSSAccessKeyId: string;
  success_action_status?: number;
  signature: string;
}

@Injectable()
export class OssUtils {
  protected options: OSSOptions;
  constructor() {
    const appConf = fileConfig() as FileConfig;
    this.options = {
      client: {
        accessKeyId: appConf.accessKeyId || '',
        accessKeySecret: appConf.secretAccessKey || '',
        bucket: appConf.ossBucket,
        endpoint: appConf.ossEndpoint,
      },
    };
  }

  /**
   * 获取私密bucket访问地址
   * @param {*} url
   * @param {*} width
   * @param {*} height
   */
  public getOssSign(url: string, width?: number, height?: number) {
    if (!url) {
      return '';
    }
    const isSelfUrl = `${this.options.client.bucket}.${this.options.client.endpoint}`;
    const isSelfUrlX: string = this.options.domain || '';

    // 判断是否包含有效地址
    if (url.indexOf(isSelfUrl) > 0 || url.indexOf(isSelfUrlX) > 0) {
      let target = url;
      let targetArray: string[] = [];
      if (url.indexOf('?') > 0) {
        targetArray = url.split('?');
        target = targetArray[0];
      }
      targetArray = target.split('com/');
      target = targetArray[1];
      return this.getSrcSign(target, width, height);
    } else {
      return url;
    }
  }

  /**
   * 获取oss文件相对路径
   * @param url
   */
  public getOssResourcePath(url: string) {
    const isSelfUrl = `${this.options.client.bucket}.${this.options.client.endpoint}`;
    const isSelfUrlX: string = this.options.domain || '';
    let target = url;
    // 判断是否包含有效地址
    if (url.indexOf(isSelfUrl) > 0 || url.indexOf(isSelfUrlX) > 0) {
      let targetArray: string[] = [];
      if (url.indexOf('?') > 0) {
        targetArray = url.split('?');
        target = targetArray[0];
      }
      targetArray = target.split('com/');
      target = targetArray[1];
    }
    return target;
  }

  public getOssPrefix(https?: boolean) {
    const http = !https;
    const clientOption = this.options.client;
    const { endpoint, bucket } = clientOption;
    let ossPrefix = `${bucket}.${endpoint}`;
    if (this.options.domain) {
      ossPrefix = this.options.domain;
    }
    return `${http ? 'http://' : 'https://'}${ossPrefix}`;
  }

  public getSrcSign(path: string, width?: number, height?: number) {
    const clientOption = this.options.client;
    const { bucket, accessKeySecret, accessKeyId } = clientOption;
    const ossPrefix = this.getOssPrefix(true);
    // 读取配置初始化参数
    const signDateTime = parseInt(moment().format('X'), 10);
    const outTime = 2 * 3600; // 失效时间
    const expireTime = signDateTime + outTime;

    let toSignString = '';
    toSignString = 'GET\n';
    const md5 = '';
    toSignString = `${toSignString}${md5}\n`;
    const contentType = '';
    toSignString = `${toSignString}${contentType}\n`;
    toSignString = `${toSignString}${expireTime}\n`;
    let resource = '';
    //去除path前的/
    path = path.replace(/^\//, '');
    if (width && height) {
      resource = `/${bucket}/${path}?x-oss-process=image/resize,m_fill,w_${width},h_${height},limit_0`;
    } else {
      resource = `/${bucket}/${path}`;
    }

    const ossHeaders = '';
    toSignString = toSignString + ossHeaders;
    toSignString = toSignString + resource;

    // hmacsha1 签名
    const sign = encodeURIComponent(
      createHmac('sha1', accessKeySecret).update(toSignString).digest('base64'),
    );
    let urlReturn = '';
    if (width && height) {
      urlReturn = `${ossPrefix}/${path}?x-oss-process=image/resize,m_fill,w_${width},h_${height},limit_0&OSSAccessKeyId=${accessKeyId}&Expires=${expireTime}&Signature=${sign}`;
    } else {
      urlReturn = `${ossPrefix}/${path}?OSSAccessKeyId=${accessKeyId}&Expires=${expireTime}&Signature=${sign}`;
    }

    return urlReturn;
  }

  public getUploadSign() {
    const policyText = {
      expiration: `${moment().add(1, 'hours').format('YYYY-MM-DDTHH:mm:ss')}.000Z`, // 设置Policy的失效时间
      conditions: [
        ['content-length-range', 0, 50048576000], // 设置上传文件的大小限制
      ],
    };
    const policyBase64 = Buffer.from(JSON.stringify(policyText)).toString(
      'base64',
    );
    const uploadSignature = createHmac(
      'sha1',
      this.options.client.accessKeySecret,
    )
      .update(policyBase64)
      .digest('base64');

    const params: ClientSign = {
      policy: policyBase64,
      OSSAccessKeyId: this.options.client.accessKeyId,
      signature: uploadSignature,
    };
    return params;
  }
}
