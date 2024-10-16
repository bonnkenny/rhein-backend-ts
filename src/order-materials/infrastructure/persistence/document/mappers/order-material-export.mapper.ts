import { OrderMaterialSchemaClass } from '@src/order-materials/infrastructure/persistence/document/entities/order-material.schema';
import { OrderMaterialColumnsMapper } from '@src/order-material-columns/infrastructure/persistence/document/mappers/order-material-columns.mapper';
import { OssUtils } from '@src/files/infrastructure/uploader/oss/oss.utils';

export class OrderMaterialExportMapper {
  static toDomain(raw: OrderMaterialSchemaClass) {
    const ossUtil = new OssUtils();
    const files: Array<string> = [];
    if (raw?.columns.length) {
      for (const column of raw.columns) {
        // const columnArray: Array<string> = [];
        const fileField = 'file';
        for (const row of column) {
          const rowI = OrderMaterialColumnsMapper.toDomain(row);
          // console.log('rowI -> ', rowI);
          if (rowI.prop.startsWith(fileField) && !!rowI.value) {
            const fileArr = rowI.value.toString().split(',');
            if (fileArr.length) {
              fileArr.forEach((file) => {
                files.push(
                  ossUtil.getSrcSign(ossUtil.getOssResourcePath(file)),
                );
              });
            }
          }
        }
      }
    }
    return files;
  }
}
