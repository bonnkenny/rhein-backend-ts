import { LabelType } from '@src/utils/types/order-types';
import { ApiProperty } from '@nestjs/swagger';
import { LabelTypeClass } from '@src/order-material-columns/domain/order-material-column';
import { IsMongoId, IsNotEmpty, IsOptional, Validate } from 'class-validator';
import { IsLabelType } from '@src/order-material-columns/validator/column-validator';

export class CreateNewsRecordsDto {
  // Don't forget to use the class-validator decorators in the DTO properties.

  @ApiProperty({
    type: String,
    example: '5f9f1b9b9c9c9c9c9c9c9c9c',
    description: 'Order ID',
    required: true,
  })
  @IsMongoId()
  orderId: string;
  @ApiProperty({
    type: String,
    example: '5f9f1b9b9c9c9c9c9c9c9c9c',
    description: 'Order material ID',
    required: false,
  })
  @IsMongoId()
  @IsOptional()
  materialId?: string;

  @ApiProperty({
    type: LabelTypeClass,
    description: 'Description',
  })
  @Validate(IsLabelType)
  @IsNotEmpty()
  description: LabelType;
}
