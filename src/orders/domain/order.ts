import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
// import { OrderTypeEnum } from '@src/utils/enums/order-type.enum';
// import { Transform } from 'class-transformer';
// import { Types } from 'mongoose';
import { IsEnum, IsOptional } from 'class-validator';
import {
  OrderFillStatusEnum,
  OrderStatusEnum,
  OrderTypeEnum,
} from '@src/utils/enums/order-type.enum';
import { OrderMaterial } from '@src/order-materials/domain/order-material';
import { User } from '@src/users/domain/user';
import { DeepPartial } from '@src/utils/types/deep-partial.type';

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
    type: String,
  })
  fromUserId: string | null;

  @ApiProperty({
    type: Boolean,
  })
  proxySet: boolean;

  @ApiProperty({
    type: String,
    enum: Object.keys(OrderStatusEnum),
  })
  @IsEnum(Object.keys(OrderStatusEnum))
  @IsOptional()
  checkStatus?: string;
  @ApiProperty({
    type: String,
    enum: Object.keys(OrderFillStatusEnum),
  })
  @IsEnum(Object.keys(OrderFillStatusEnum))
  @IsOptional()
  fillStatus?: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
  @ApiProperty({
    type: [OrderMaterial],
  })
  materials?: OrderMaterial[];
  @ApiPropertyOptional({
    type: () => User,
  })
  user?: DeepPartial<User>;

  @ApiPropertyOptional({
    type: () => Array<string>,
  })
  nodeLines?: string[];
}
