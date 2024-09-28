import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsMongoId, IsNotEmpty } from 'class-validator';

export class CreateOrderUserDto {
  // Don't forget to use the class-validator decorators in the DTO properties.
  @ApiProperty({
    type: Array,
    required: true,
  })
  @IsMongoId({ each: true })
  @IsArray()
  @IsNotEmpty()
  userIds: [];

  @ApiProperty({
    type: String,
    required: true,
  })
  @IsMongoId()
  @IsNotEmpty()
  orderId: string;
}
