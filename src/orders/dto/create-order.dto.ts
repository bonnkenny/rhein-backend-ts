import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { OrderTypeEnum } from '@src/utils/enums/order-type.enum';
import { Transform } from 'class-transformer';
import { Types } from 'mongoose';

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
  @IsNotEmpty()
  @IsString()
  @MaxLength(100, { message: 'Order name is too long' })
  orderName: string;

  @ApiProperty({
    type: String,
  })
  @IsNotEmpty()
  @IsEnum(Object.keys(OrderTypeEnum))
  orderType: string;

  @ApiProperty({
    type: String,
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => {
    return !!value ? new Types.ObjectId(value) : value;
  })
  parentId?: string;

  @ApiProperty({
    type: String,
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    type: String,
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => {
    return !!value ? new Types.ObjectId(value) : value;
  })
  userId?: string;
}
