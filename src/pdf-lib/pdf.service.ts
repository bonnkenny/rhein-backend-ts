import { Inject, Injectable } from '@nestjs/common';
import { PDFDocument } from 'pdf-lib';
import { FilesOssService } from '@src/files/infrastructure/uploader/oss/files.service';

@Injectable()
export class PdfService {
  constructor(@Inject() private readonly ossService: FilesOssService) {}
  // 拼接PDF的方法
  async mergePdfs(pdfPaths: string[]): Promise<Buffer> {
    // 创建一个新的 PDF 文档
    const mergedPdf = await PDFDocument.create();

    for (const pdfPath of pdfPaths) {
      // 读取 PDF 文件
      const pdfObject = await this.ossService.getObject(pdfPath);
      // 加载 PDF 文件
      const pdfBytes = pdfObject.content;
      const pdf = await PDFDocument.load(pdfBytes);
      // 复制页面
      const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
      // 将页面加入合并文档
      copiedPages.forEach((page) => mergedPdf.addPage(page));
    }
    // 保存合并后的 PDF 文档
    const mergedPdfBytes = await mergedPdf.save();
    // 返回结果
    return Buffer.from(mergedPdfBytes);
  }
}
