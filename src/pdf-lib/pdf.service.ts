import { Inject, Injectable } from '@nestjs/common';
import { PDFDocument } from 'pdf-lib';
import { FilesOssService } from '@src/files/infrastructure/uploader/oss/files.service';
import { PdfObjectDto } from '@src/pdf-lib/dto/pdf-object.dto';
import { OssUtils } from '@src/files/infrastructure/uploader/oss/oss.utils';
import fs from 'node:fs/promises';

import fontkit from 'fontkit';

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

  async mergeMultiplePdfs(pdfs: Array<PdfObjectDto>) {
    // 创建一个新的 PDF 文档
    const mergedPdf = await PDFDocument.create();
    mergedPdf.registerFontkit(fontkit);
    const fontBytes = await fs.readFile('storage/fonts/OPPOSans-Medium.ttf'); // 替换为你的字体路径
    const customFont = await mergedPdf.embedFont(fontBytes);
    for (const pdf of pdfs) {
      // console.log('pdf -> ', pdf);
      const { paths, columns } = pdf;
      // console.log('paths -> ', paths);
      for (const path of paths) {
        const basePath = path.split('?')[0] ?? null;
        const file = await this.ossService.getObject(
          new OssUtils().getOssResourcePath(path),
        );
        const fileBytes = file.content;
        // 拼接pdf
        if (
          basePath &&
          (basePath.endsWith('.jpg') || basePath.endsWith('.png'))
        ) {
          const image = basePath.endsWith('.png')
            ? await mergedPdf.embedPng(fileBytes)
            : await mergedPdf.embedJpg(fileBytes);
          const image_page = await mergedPdf.addPage();
          image_page.drawImage(image);
        } else if (basePath && basePath.endsWith('.pdf')) {
          const pdfLoad = await PDFDocument.load(fileBytes);
          // 复制页面
          const copiedPages = await mergedPdf.copyPages(
            pdfLoad,
            pdfLoad.getPageIndices(),
          );
          // 将页面加入合并文档
          copiedPages.forEach((page) => mergedPdf.addPage(page));
        }
      }
      // 写入资料简介
      let text: string = '';
      for (const column of columns) {
        const { prop } = column;
        if (['file', 'img'].includes(prop)) {
          continue;
        }
        text += `${column.label?.en}: ${column.value} \n`;
      }

      if (text) {
        console.log('text -> ', text);
        const blankPage = mergedPdf.addPage();
        blankPage.drawText(text, {
          x: 50,
          y: blankPage.getHeight() - 50,
          size: 18,
          font: customFont,
        });
      }
    }

    // 保存合并后的 PDF 文档
    const mergedPdfBytes = await mergedPdf.save();
    // 返回结果
    return Buffer.from(mergedPdfBytes);
  }
}
