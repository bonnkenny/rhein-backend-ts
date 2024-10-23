import { OrderMaterialColumn } from '@src/order-material-columns/domain/order-material-column';

export class PdfObjectDto {
  paths: Array<string>;
  columns: Array<OrderMaterialColumn>;
}
