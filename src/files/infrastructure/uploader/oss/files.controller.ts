import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilesOssService } from './files.service';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { infinityResponse } from '@src/utils/infinity-response';
import { InfinityApiResponseDto } from '@src/utils/dto/infinity-base-response.dto';

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

  @ApiOkResponse({ description: 'Upload file', type: InfinityApiResponseDto })
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  public async uploadFile(@UploadedFile() file: Express.Multer.File) {
    // console.log('file -> ', file);
    const uploaded = await this.oSSService.upload(file);
    return infinityResponse(uploaded);
  }
}
