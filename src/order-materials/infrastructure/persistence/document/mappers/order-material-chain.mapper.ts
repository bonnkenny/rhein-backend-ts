import { OrderMaterialSchemaClass } from '@src/order-materials/infrastructure/persistence/document/entities/order-material.schema';
import { OrderMaterialColumnsMapper } from '@src/order-material-columns/infrastructure/persistence/document/mappers/order-material-columns.mapper';

export class OrderMaterialChainMapper {
  static toDomain(raw: OrderMaterialSchemaClass) {
    const domainColumns: Array<string> = [];
    if (raw?.columns.length) {
      for (const column of raw.columns) {
        // const columnArray: Array<string> = [];
        const nameTuple = ['sellerName', 'materialName', 'name'];
        const specificationTuple = ['specificatuion', 'specification'];
        const quantityTuple = ['quantity'];
        const unitTuple = ['unit'];
        let lineName: string = '',
          lineSpecification: string = '',
          lineQuantity: string = '',
          lineUnit: string = '';
        for (const row of column) {
          const rowI = OrderMaterialColumnsMapper.toDomain(row);
          // console.log('rowI -> ', rowI);
          if (
            !lineName &&
            nameTuple.some((t) => row.prop === t || row.prop.startsWith(t))
          ) {
            lineName = rowI.value ? String(rowI.value) : '';
          }
          if (
            !lineSpecification &&
            specificationTuple.some(
              (t) => row.prop === t || row.prop.startsWith(t),
            )
          ) {
            lineSpecification = rowI.value ? String(rowI.value) : '';
          }
          if (
            !lineQuantity &&
            quantityTuple.some((t) => row.prop === t || row.prop.startsWith(t))
          ) {
            lineQuantity = rowI.value ? String(rowI.value) : '';
          }
          if (
            !lineUnit &&
            unitTuple.some((t) => row.prop === t || row.prop.startsWith(t))
          ) {
            lineUnit = rowI.value ? String(rowI.value) : '';
          }
        }
        const line = `${lineName} ${lineSpecification} ${lineQuantity} ${lineUnit}`;
        // console.log('line -> ', line);
        if (lineQuantity && line.trim()) {
          // columnArray.push(line);
          domainColumns.push(line);
        }
      }
    }
    return domainColumns;
  }
}
