import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { OrderTypeEnum } from '@src/utils/enums/order-type.enum';

export class CreateOrderDto {
  // Don't forget to use the class-validator decorators in the DTO properties.
  @ApiProperty({
    type: String,
  })
  @IsNotEmpty()
  @MaxLength(100, { message: 'OrderNo is too long' })
  orderNo: string;

  @ApiProperty({
    type: String,
  })
  @MaxLength(100, { message: 'Order name is too long' })
  @IsString()
  @IsNotEmpty()
  orderName: string;

  @ApiProperty({
    type: String,
    enum: Object.keys(OrderTypeEnum),
  })
  @IsEnum(Object.keys(OrderTypeEnum), {
    message:
      'Invalid order type,order type must be one of the following values:' +
      Object.keys(OrderTypeEnum).join(' '),
  })
  @IsNotEmpty()
  orderType: string;

  @ApiProperty({
    type: String,
  })
  @IsMongoId()
  @IsString()
  @IsOptional()
  // @Transform(({ value }) => {
  //   return !!value ? new Types.ObjectId(value) : value;
  // })
  parentId?: string;

  @ApiProperty({
    type: String,
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({
    type: String,
  })
  @IsMongoId()
  @IsString()
  @IsNotEmpty({ message: 'User id is required' })
  userId: string;

  // @ApiProperty({
  //   type: Number,
  //   enum: [1, 2, -1],
  // })
  // checkStatus?: number;
  // @ApiProperty({
  //   type: Number,
  //   enum: [1, 2, 3, -1],
  // })
  // fillStatus?: number;
}
