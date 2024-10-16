import { Module } from '@nestjs/common';
import { PdfService } from './pdf.service';
import { FilesOssModule } from '@src/files/infrastructure/uploader/oss/files.module';

@Module({
  imports: [FilesOssModule],
  providers: [PdfService],
  exports: [PdfService],
})
export class PdfModule {}
