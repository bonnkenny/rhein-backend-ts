import { OrderMaterialSchemaClass } from '@src/order-materials/infrastructure/persistence/document/entities/order-material.schema';
import { OrderMaterialColumnsMapper } from '@src/order-material-columns/infrastructure/persistence/document/mappers/order-material-columns.mapper';

export class OrderMaterialChainMapper {
  static toDomain(raw: OrderMaterialSchemaClass) {
    const domainColumns: Array<string> = [];
    if (raw?.columns.length) {
      for (const column of raw.columns) {
        // const columnArray: Array<string> = [];
        const nameTumple = ['sellerName', 'materialName', 'name'];
        const specificationTumple = ['specificatuion', 'specification'];
        const quantityTumple = ['quantity'];
        const unitTumple = ['unit'];
        let lineName: string = '',
          lineSpecification: string = '',
          lineQuantity: string = '',
          lineUnit: string = '';
        for (const row of column) {
          const rowI = OrderMaterialColumnsMapper.toDomain(row);
          console.log('rowI -> ', rowI);
          if (!lineName && nameTumple.includes(row.prop)) {
            lineName = rowI.value ? String(rowI.value) : '';
          }
          if (!lineSpecification && specificationTumple.includes(row.prop)) {
            lineSpecification = rowI.value ? String(rowI.value) : '';
          }
          if (!lineQuantity && quantityTumple.includes(row.prop)) {
            lineQuantity = rowI.value ? String(rowI.value) : '';
          }
          if (!lineUnit && unitTumple.includes(row.prop)) {
            lineUnit = rowI.value ? String(rowI.value) : '';
          }
        }
        const line = `${lineName} ${lineSpecification} ${lineQuantity} ${lineUnit}`;
        console.log('line -> ', line);
        if (lineQuantity && line.trim()) {
          // columnArray.push(line);
          domainColumns.push(line);
        }
      }
    }
    return domainColumns;
  }
}
