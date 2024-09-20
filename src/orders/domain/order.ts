import { ApiProperty } from '@nestjs/swagger';
// import { OrderTypeEnum } from '@src/utils/enums/order-type.enum';
import { Transform } from 'class-transformer';
import { Types } from 'mongoose';

export class Order {
  @ApiProperty({
    type: String,
  })
  id: string;

  @ApiProperty({
    type: String,
  })
  orderNo: string;

  @ApiProperty({
    type: String,
  })
  orderName: string;

  @ApiProperty({
    type: String,
  })
  orderType: string;

  @ApiProperty({
    type: String,
  })
  parentId?: string;

  @ApiProperty({
    type: String,
  })
  email: string;

  @ApiProperty({
    type: String,
  })
  @Transform(({ value }) => {
    return !!value ? new Types.ObjectId(value) : value;
  })
  userId?: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
