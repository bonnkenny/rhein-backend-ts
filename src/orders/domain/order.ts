import { ApiProperty } from '@nestjs/swagger';
// import { OrderTypeEnum } from '@src/utils/enums/order-type.enum';
// import { Transform } from 'class-transformer';
// import { Types } from 'mongoose';
import { IsOptional } from 'class-validator';
import { OrderTypeEnum } from '@src/utils/enums/order-type.enum';

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
    enum: Object.keys(OrderTypeEnum),
  })
  orderType: string;

  @ApiProperty({
    type: String,
    nullable: true,
  })
  parentId?: string | null;

  @ApiProperty({
    type: String,
    nullable: true,
  })
  email?: string | null;

  @ApiProperty({
    type: String,
  })
  userId: string;

  @ApiProperty({
    type: Number,
    enum: [1, 2, -1],
  })
  @IsOptional()
  checkStatus?: number;
  @ApiProperty({
    type: Number,
    enum: [1, 2, 3, -1],
  })
  @IsOptional()
  fillStatus?: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
