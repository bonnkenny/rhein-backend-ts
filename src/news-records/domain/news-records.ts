import { ApiProperty } from '@nestjs/swagger';
import { LabelTypeClass } from '@src/order-material-columns/domain/order-material-column';
import { LabelType } from '@src/utils/types/order-types';

export class NewsRecords {
  @ApiProperty({
    type: String,
  })
  id: string;

  @ApiProperty({
    type: String,
  })
  orderId: string;

  @ApiProperty({
    type: String,
  })
  materialId: string;

  @ApiProperty({
    type: String,
  })
  action: string;

  @ApiProperty({
    type: LabelTypeClass,
  })
  description: LabelType;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
