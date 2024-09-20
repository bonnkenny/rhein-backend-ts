import { ApiProperty } from '@nestjs/swagger';
import { OrderMaterialColumn } from '@src/order-material-columns/domain/order-material-column';

export class OrderMaterialTemplate {
  @ApiProperty({
    type: String,
  })
  id: string;
  @ApiProperty({
    type: String,
  })
  orderType: string;

  columns: Array<Array<OrderMaterialColumn>>;

  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  updatedAt: Date;
}
